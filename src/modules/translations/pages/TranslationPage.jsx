import TranslationContainer from "../containers/TranslationContainer";
import HasAccess from "../../../services/auth/HasAccess.jsx";
import config from "../../../config.js";

const TranslationPage = () => {
    return <HasAccess access={[config.ROLES.ROLE_SUPER_ADMIN,config.ROLES.ROLE_ADMIN]}><TranslationContainer/></HasAccess>
}
export default TranslationPage