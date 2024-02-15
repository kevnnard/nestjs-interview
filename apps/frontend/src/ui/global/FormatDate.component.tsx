export const FormatDateComponentGlobal = ({
	date,
	lang,
}: {
	date: Date;
	lang: string;
}) => {
	return new Date(date).toLocaleString(`${lang}-US`, {
		weekday: "short",
		month: "short",
		day: "numeric",
		year: "numeric",
		timeZoneName: "short",
		timeZone: "America/Bogota",
	});
};
