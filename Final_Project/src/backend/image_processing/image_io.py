from PIL import Image
import numpy as np

def load_image(path):
    """
    Reads image and converts it to numpy array
    Returns:
        image_array : numpy array (H,W,3)
    """
    img = Image.open(path)
    img = img.convert("RGB")   # ضمان ان الصورة 3 قنوات
    img_array = np.array(img)
    return img_array


def save_image(np_array, path):
    """
    Save numpy array as image
    """
    img = Image.fromarray(np_array.astype(np.uint8))
    img.save(path)