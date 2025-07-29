import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
dayjs.extend(utc);
dayjs.extend(timezone);

const userTimezone = "America/Mexico_City";

const formatted = (timestamp) => {
    if (!timestamp || !dayjs(timestamp).isValid()) {
        return "Fecha no disponible";
    }

    return dayjs(timestamp).tz(userTimezone).format("DD/MM/YYYY hh:mm A");
};

export { formatted };
