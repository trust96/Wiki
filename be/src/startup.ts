import { setAuthEventListener } from "./api/auth/auth.event";
import { setUserEventListener } from "./api/user/user.event";
const startUp = async () => {
  globalThis.gemmaState = {};
  setAuthEventListener();
  setUserEventListener();
};

export default startUp;
