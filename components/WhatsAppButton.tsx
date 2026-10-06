import { getWhatsAppNumber } from "@/lib/content";

export default async function WhatsAppButton() {
  const number = await getWhatsAppNumber();
  const url = `https://wa.me/${number}?text=${encodeURIComponent(
    "Hello AutoPro Garage, I'd like to make an enquiry."
  )}`;

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat with AutoPro Garage on WhatsApp"
      className="fixed bottom-5 right-5 z-30 inline-flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg transition-transform hover:scale-105"
    >
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width="26" height="26" fill="currentColor" aria-hidden="true">
        <path d="M16.004 2.667C8.64 2.667 2.67 8.638 2.67 16c0 2.35.615 4.642 1.783 6.667L2.667 29.333l6.84-1.792a13.33 13.33 0 006.497 1.665h.005c7.364 0 13.333-5.97 13.333-13.334 0-3.558-1.386-6.9-3.9-9.414A13.244 13.244 0 0016.005 2.667zm0 24.342h-.003a11.07 11.07 0 01-5.636-1.544l-.405-.24-4.056 1.064 1.082-3.953-.264-.42A11.07 11.07 0 014.98 16c0-6.078 4.946-11.024 11.027-11.024 2.944 0 5.712 1.147 7.793 3.228A10.97 10.97 0 0127.027 16c0 6.08-4.946 11.009-11.023 11.009zm6.045-8.252c-.33-.166-1.956-.966-2.26-1.077-.303-.11-.524-.165-.746.166-.22.33-.853 1.076-1.045 1.297-.192.22-.385.248-.715.083-.33-.165-1.395-.514-2.657-1.639-.982-.875-1.646-1.957-1.838-2.287-.193-.33-.021-.508.145-.673.149-.148.33-.385.496-.578.165-.193.22-.33.33-.55.11-.22.055-.413-.027-.578-.083-.165-.746-1.796-1.023-2.46-.27-.646-.544-.558-.746-.568-.192-.009-.413-.011-.634-.011s-.579.083-.882.413c-.303.33-1.156 1.127-1.156 2.747 0 1.62 1.183 3.185 1.348 3.405.165.22 2.329 3.558 5.643 4.986.788.34 1.403.544 1.882.697.79.252 1.51.216 2.078.131.634-.094 1.956-.8 2.232-1.572.277-.772.277-1.433.193-1.572-.082-.137-.303-.22-.633-.385z" />
      </svg>
    </a>
  );
}
