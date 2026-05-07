from image_processing.image_io import load_image, save_image
from image_processing.quantization import quantize_color_image

img = load_image("test.jpg")

poster_color = quantize_color_image(img, levels=4)

save_image(poster_color, "poster_color_4.jpg")
print("Color poster saved!")