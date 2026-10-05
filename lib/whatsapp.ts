export const WHATSAPP_NUMBER =
  process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "254727718981";

export function buildWhatsAppUrl(message: string): string {
  const encoded = encodeURIComponent(message);
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encoded}`;
}

export function bookingMessage(opts: {
  name: string;
  phone: string;
  vehicleMake: string;
  vehicleModel: string;
  service: string;
  preferredDate: string;
  reference: string;
}): string {
  return [
    `Hello AutoPro Garage 👋`,
    ``,
    `I've just submitted a booking.`,
    `Ref: ${opts.reference}`,
    `Name: ${opts.name}`,
    `Phone: ${opts.phone}`,
    `Vehicle: ${opts.vehicleMake} ${opts.vehicleModel}`,
    `Service: ${opts.service}`,
    `Preferred date: ${opts.preferredDate}`,
    ``,
    `Please confirm availability.`
  ].join("\n");
}
