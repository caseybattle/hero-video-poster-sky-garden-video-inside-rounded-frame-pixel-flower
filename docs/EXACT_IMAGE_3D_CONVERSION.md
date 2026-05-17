# Exact Image To 3D Conversion

## Status
Completed.

## What This Is
The supplied PNG is imported directly as the texture on a 3D object and exported as `.glb`.

This preserves the actual image instead of rebuilding the face as procedural geometry.

## Best Output For The Website
- `outputs/casey_3d_character/casey_exact_image_3d_card.glb`

This is the clean web-ready 3D object format. It can be loaded in Three.js / React Three Fiber.

## Preview
- `outputs/casey_3d_character/casey_exact_image_3d_card_render.png`

## Alternate Output
- `outputs/casey_3d_character/casey_exact_image_curved_3d.glb`

This uses the same exact image texture on a subtly curved mesh. The flat card is the safer default because it preserves the image framing most faithfully.

## Distinction From Previous Bust
The earlier `casey_3d_bust.*` files were a stylized procedural interpretation. These `casey_exact_image_*` files are direct image-to-3D-object conversions.
