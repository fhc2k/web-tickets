import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";

dayjs.extend(utc);

const formatted = (timestamp) => {
    return dayjs(timestamp)
        .utc()
        .format("YYYY-MM-DD HH:mm:ss [GMT]");
};

export { formatted };
