import Image
import glob
import os

## Global Variables
FILETYPES = ['*.tiff','*.jpeg','*.png']
NEWIMAGESIZE = 400

## Functions
def convert2jpg():
    for types in FILETYPES:
        openFiles = glob.glob(types)
        
        for files in openFiles:
            inFile = Image.open(files) 
            fileName = os.path.splitext(files)[0] # gets filename
            outFile = fileName + ".jpg" 
            inFile.save(outFile)
            print fileName + " ... converted"
            
    print "\n"
    return None

def delOldFileTypes():
    for types in FILETYPES:
        openFiles = glob.glob(types)
        
        for files in openFiles:
            os.remove(files)
            print files + " ... deleted"
            
    print "\n"
    return None
    

def resize(): 
    openFiles = glob.glob('*.jpg')
    
    for files in openFiles:
        inFile = Image.open(files)
        fileName = os.path.splitext(files)[0] # gets filename
        outFile = fileName + ".jpg"
        print fileName
        print "Origonal size ",inFile.size
        xDim = inFile.size[0]
        yDim = inFile.size[1]        
        newSize = aspectRatio(xDim, yDim)       
        inFile = inFile.resize((int(newSize[0]),int(newSize[1])),(int(newSize[0]) * 2,int(newSize[1]) * 2))
        inFile.save(outFile)
        print "New Size ",inFile.size, "\n"
        
    return None

def aspectRatio(xDim, yDim):
    
    if xDim <= NEWIMAGESIZE and yDim <= NEWIMAGESIZE: #ensures images already correct size are not enlarged.
        return(xDim, yDim)
    
    elif xDim > yDim:
        divider = xDim/float(NEWIMAGESIZE)
        xDim = float(xDim/divider)
        yDim = float(yDim/divider)
        return(xDim, yDim)
        
    elif yDim > xDim:
        divider = yDim/float(NEWIMAGESIZE)
        xDim = float(xDim/divider)
        yDim = float(yDim/divider)
        return(xDim, yDim)
       
    elif xDim == yDim:
        xDim = NEWIMAGESIZE
        yDim = NEWIMAGESIZE
        return(xDim, yDim)

#convert2jpg()
#delOldFileTypes()
resize()

print ('All Done!!!')
raw_input('Images Resized... Press any key to continue')