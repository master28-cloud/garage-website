export function buildWhatsAppUrl(message: string, number: string): string {
  return `https://wa.me/${number}?text=${encodeURIComponent(message)}`;
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
