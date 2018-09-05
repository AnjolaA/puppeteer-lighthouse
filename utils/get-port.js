export const getPort = async (string) => {
    const re = /127.0.0.1:(.*)\/dev/;
    const port = re.exec(string);
    return port[1];
};
