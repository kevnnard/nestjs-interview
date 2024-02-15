import { authorization } from './middlewares/authorization';
import { stackMiddlewares } from './middlewares/stackHandler';

const middlewares = [authorization];
export default stackMiddlewares(middlewares);
