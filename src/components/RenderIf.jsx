const RenderIf = ({ children, condition }) => {
    return condition ? children : "";
};

export default RenderIf;