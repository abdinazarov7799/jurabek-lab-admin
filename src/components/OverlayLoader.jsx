import {Flex, Spin} from "antd";
const OverlayLoader = () => {
    return(
        <Flex align="center" gap="middle">
            <Spin size="large" fullscreen={true} />
        </Flex>
    )
}
export default OverlayLoader
