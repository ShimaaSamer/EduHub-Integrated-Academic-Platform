import numpy as np

def quantize_gray_image(gray_img, levels=4):
    """
    Apply intensity quantization on grayscale image
    
    levels = number of gray levels المطلوبة
    مثال: 2,4,8,16
    """
    
    # حجم كل مجموعة
    step = 256 // levels
    
    height, width = gray_img.shape
    quantized = np.zeros((height, width))
    
    for i in range(height):
        for j in range(width):
            
            pixel = gray_img[i, j]
            
            # تحديد المجموعة
            bucket = pixel // step
            
            # قيمة منتصف المجموعة
            new_value = bucket * step + step // 2
            
            quantized[i, j] = new_value
            
    return quantized.astype(np.uint8)

def quantize_color_image(image, levels=4):
    """
    Apply posterization on RGB image
    Quantization لكل قناة لون
    """
    
    step = 256 // levels
    
    height, width, channels = image.shape
    quantized = np.zeros((height, width, channels))
    
    for i in range(height):
        for j in range(width):
            for c in range(3):  # R,G,B
                
                pixel = image[i, j, c]
                bucket = pixel // step
                new_value = bucket * step + step // 2 # Middle value of the bucket
                
                quantized[i, j, c] = new_value
                
    return quantized.astype(np.uint8)