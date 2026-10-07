# Before / After gallery photos

The gallery currently ships with **stock placeholders**. In those pairs the
before and after frames are **different vehicles** — no stock library sells the
same car photographed damaged and then repaired. Replace them before launch.

## You already have the real photos

Every vehicle that comes in for an insurance job gets photographed twice:

1. **Intake** — the damage shots taken for the assessor.
2. **Handover** — the delivery shots taken when the customer collects.

That is exactly a before/after pair. Pull six of your best from the workshop
phone or the claim files.

## Naming

Drop files into this folder using this pattern:

```
01-before.jpg   01-after.jpg
02-before.jpg   02-after.jpg
03-before.jpg   03-after.jpg
04-before.jpg   04-after.jpg
05-before.jpg   05-after.jpg
06-before.jpg   06-after.jpg
```

## Wiring them up

Open `components/BeforeAfterGallery.tsx` and change the two strings per entry:

```ts
{
  tag: "Collision",
  title: "Front-end impact rebuild",
  before: "/images/gallery/01-before.jpg",
  after:  "/images/gallery/01-after.jpg"
},
```

Nothing else changes. The sweep, hover and drag all keep working.

## How the section lays out

- The **first** pair is shown full width at **16:9**. Put your most dramatic job here.
- The rest sit in a two-column grid at **3:2**. A lone last pair spans the full row.
- Reorder from the admin Gallery tab to choose which pair leads.

The current files here (`corsa-*`, `fiesta-*`, `toyota-*`) are stock placeholders,
matched on make, model, colour and camera angle. Two are mirrored so each pair
faces the same way. Mirroring is only safe when no lettering or asymmetric badge
is readable — never mirror a photo showing a number plate or a VW/GTI badge.

## Shooting tips

The reveal only looks right when the two frames line up:

- Same **position** — mark the floor with tape and shoot from that spot both times.
- Same **height** — chest height is fine, just keep it consistent.
- Same **angle and zoom** — a three-quarter front view reads best.
- Same **lighting** — inside the bay with the doors open beats harsh sunlight.
- **Landscape** orientation, 4:3 or wider. Aim for 1600px on the long edge.

Keep each file under about 400KB. [Squoosh](https://squoosh.app) compresses
without a visible quality drop.

## Consent

Get the customer's written permission before publishing photos of their
vehicle, and crop or blur number plates unless they have agreed to those being
shown. Number plates are personal data under the Kenya Data Protection Act 2019.
