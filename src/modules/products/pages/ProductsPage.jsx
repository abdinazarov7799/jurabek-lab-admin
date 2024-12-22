import ProductsContainer from "../containers/ProductsContainer.jsx";
import HasAccess from "../../../services/auth/HasAccess.jsx";
import config from "../../../config.js";

const ProductsPage = () => {
  return <HasAccess access={[config.ROLES.ROLE_SUPER_ADMIN,config.ROLES.ROLE_ADMIN,config.ROLES.ROLE_USER]}><ProductsContainer /></HasAccess>
}
export default ProductsPage
