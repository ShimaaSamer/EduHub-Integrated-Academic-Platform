import numpy as np

def rgb_to_grayscale(image):
    """
    Convert RGB image to Grayscale manually (pixel by pixel)
    Input: image (H,W,3)
    Output: gray_image (H,W)
    """
    
    height, width, _ = image.shape
    
    # إنشاء صورة فاضية
    gray = np.zeros((height, width))
    
    for i in range(height):
        for j in range(width):
            R = image[i, j, 0]
            G = image[i, j, 1]
            B = image[i, j, 2]
            
            gray_value = 0.299 * R + 0.587 * G + 0.114 * B
            gray[i, j] = gray_value
            
    return gray.astype(np.uint8)