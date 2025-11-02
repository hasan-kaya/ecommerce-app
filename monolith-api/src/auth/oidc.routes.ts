import { Request, Response, NextFunction, Router } from 'express';

import { oidc } from './oidc-provider';

import { AuthService } from '@/services/AuthService';
import { SessionService } from '@/services/SessionService';

const router = Router();
const authService = new AuthService();
const sessionService = new SessionService();

router.get('/:uid', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const details = await oidc.interactionDetails(req, res);

    if (details.prompt.name === 'consent') {
      res.send(`
        <html>
          <head>
            <title>Authorize Application</title>
            <style>
              body { font-family: Arial, sans-serif; max-width: 400px; margin: 100px auto; padding: 20px; }
              h3 { color: #333; }
              button { background: #0070f3; color: white; border: none; padding: 10px 20px; cursor: pointer; border-radius: 5px; }
              button:hover { background: #0051cc; }
            </style>
          </head>
          <body>
            <h3>Authorize Application</h3>
            <p>The application is requesting access to your account.</p>
            <form method="post" action="/interaction/${req.params.uid}/confirm">
              <button type="submit">Allow</button>
            </form>
          </body>
        </html>
      `);
      return;
    }

    res.send(`
      <html>
        <head>
          <title>Sign In</title>
          <style>
            body { font-family: Arial, sans-serif; max-width: 400px; margin: 100px auto; padding: 20px; }
            h3 { color: #333; }
            input { width: 100%; padding: 10px; margin: 10px 0; border: 1px solid #ddd; border-radius: 5px; box-sizing: border-box; }
            button { width: 100%; background: #0070f3; color: white; border: none; padding: 10px; cursor: pointer; border-radius: 5px; margin-top: 10px; }
            button:hover { background: #0051cc; }
          </style>
        </head>
        <body>
          <h3>Sign In</h3>
          <form method="post" action="/interaction/${req.params.uid}/login">
            <input type="email" name="email" placeholder="Email" required />
            <input type="text" name="name" placeholder="Name" required />
            <button type="submit">Login</button>
          </form>
        </body>
      </html>
    `);
  } catch (err) {
    next(err);
  }
});

router.post('/:uid/login', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, name } = req.body;

    const user = await authService.findOrCreateOAuthUser(email, name);

    const sessionToken = await sessionService.createSession(user.id, user.email, user.role);

    res.cookie('session_token', sessionToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    const result = {
      login: {
        accountId: email,
      },
    };
    await oidc.interactionFinished(req, res, result, { mergeWithLastSubmission: false });
  } catch (err) {
    next(err);
  }
});

router.post('/:uid/confirm', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const interactionDetails = await oidc.interactionDetails(req, res);
    const {
      prompt: { name, details },
      params,
      session,
    } = interactionDetails as any;
    const accountId = session?.accountId;

    let result = { consent: {} };

    if (name === 'consent') {
      const grant = new (oidc as any).Grant({
        accountId,
        clientId: params.client_id as string,
      });

      if (details) {
        const missingOIDCScope = (details as any).missingOIDCScope || [];
        const missingOIDCClaims = (details as any).missingOIDCClaims || [];
        const missingResourceScopes = (details as any).missingResourceScopes || {};

        if (missingOIDCScope.length > 0) {
          grant.addOIDCScope(missingOIDCScope.join(' '));
        }
        if (Object.keys(missingOIDCClaims).length > 0) {
          grant.addOIDCClaims(missingOIDCClaims);
        }
        if (Object.keys(missingResourceScopes).length > 0) {
          for (const [indicator, scopes] of Object.entries(missingResourceScopes)) {
            grant.addResourceScope(indicator, (scopes as string[]).join(' '));
          }
        }
      }

      const grantId = await grant.save();
      result = { consent: { grantId } };
    }

    await oidc.interactionFinished(req, res, result, { mergeWithLastSubmission: true });
  } catch (err) {
    next(err);
  }
});

export default router;
