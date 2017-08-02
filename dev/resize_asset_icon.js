var Jimp = require("jimp");

// open a file called "lenna.png"
Jimp.read("assets/icon/ic_launcher.png", function (err, image) {
    if (err) console.log(err);
    [144, 96, 86, 72, 48].forEach((size) => {
        image.resize(size, size)            // resize
            .write("assets/icon/ic_launcher."+size+"x"+size+".png"); // save
    }
    )
});
