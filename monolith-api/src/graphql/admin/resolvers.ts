import { Scope } from '@/auth/scopes';
import { GraphQLContext, requireScope } from '@/graphql/utils/auth';
import { AdminService } from '@/services/AdminService';

const adminService = new AdminService();

export const adminResolvers = {
  Query: {
    adminStats: async (_: any, __: any, context: GraphQLContext) => {
      requireScope(context, Scope.ADMIN);
      return adminService.getAdminStats();
    },
  },
};
