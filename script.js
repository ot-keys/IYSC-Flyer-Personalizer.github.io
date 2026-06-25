const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

const loader = document.getElementById("loader");
const downloadBtn = document.getElementById("downloadBtn");
const shareBtn = document.getElementById("shareBtn");

let cropper;
let croppedImage = null;


// =====================
// FLYER BACKGROUND
// =====================

const bg = new Image();
bg.src = "flyer.png";

bg.onload = () => {
    ctx.drawImage(bg, 0, 0, canvas.width, canvas.height);
};


// =====================
// DRAW CIRCULAR IMAGE
// =====================

function drawCircularImage(img, x, y, width, height) {

    ctx.save();

    ctx.beginPath();

    ctx.arc(
        x + width / 2,
        y + height / 2,
        width / 2,
        0,
        Math.PI * 2
    );

    ctx.closePath();
    ctx.clip();

    // Draw EXACT cropped image
    ctx.drawImage(
        img,
        x,
        y,
        width,
        height
    );

    ctx.restore();


    // Border

    ctx.beginPath();

    ctx.arc(
        x + width / 2,
        y + height / 2,
        width / 2,
        0,
        Math.PI * 2
    );

    ctx.lineWidth = 8;
    ctx.strokeStyle = "#ffffff";
    ctx.stroke();
}


// =====================
// GENERATE FLYER
// =====================

function generateFlyer() {
    

    const file =
        document.getElementById("photo").files[0];

    const name =
        document.getElementById("name")
        .value
        .trim()
        .toUpperCase();

    const location =
        document.getElementById("location")
        .value
        .trim()
        .toUpperCase();

    if (!file) {
        alert("Please upload your picture.");
        return;
    }

    loader.style.display = "inline-block";

    // Clear canvas

    ctx.clearRect(
        0,
        0,
        canvas.width,
        canvas.height
    );

    // Draw background

    ctx.drawImage(
        bg,
        0,
        0,
        canvas.width,
        canvas.height
    );

    const img = new Image();

    img.onload = function () {

        /*
        =====================
        USER PHOTO
        =====================
        */

        drawCircularImage(
            img,
            110, // X position
            150, // Y position
            320, // Width
            320  // Height
        );


        /*
        =====================
        USER NAME
        =====================
        */

        ctx.font = "bold 42px Raleway";
        ctx.fillStyle = "#111";
        ctx.textAlign = "center";

        wrapText(
            name,
            740,
            310,  //up/down
            350,
            45
        );


        /*
        =====================
        LOCATION
        =====================
        */

        ctx.font = "bold 27px Raleway";
        ctx.fillStyle = "#ffffff";
        ctx.textAlign = "left";

        wrapText(
            location,
            70,
            1200,
            450,
            30
        );


        loader.style.display = "none";


        /*
        =====================
        DOWNLOAD BUTTON
        =====================
        */

        downloadBtn.href =
            canvas.toDataURL("image/png");

        downloadBtn.download =
            "gck-flyer.png";

        downloadBtn.style.display =
            "inline-block";

        shareBtn.style.display = "inline-block";
    };


    // VERY IMPORTANT:
    // Use cropped image if user cropped

    if (croppedImage) {

        img.src = croppedImage;

    } else {

        const reader = new FileReader();

        reader.onload = function (e) {
            img.src = e.target.result;
        };

        reader.readAsDataURL(file);
    }
}



// =====================
// TEXT WRAPPING
// =====================

function wrapText(
    text,
    x,
    y,
    maxWidth,
    lineHeight
) {

    let words = text.split(" ");
    let line = "";

    for (let n = 0; n < words.length; n++) {

        let testLine =
            line + words[n] + " ";

        let metrics =
            ctx.measureText(testLine);

        let width =
            metrics.width;

        if (
            width > maxWidth &&
            n > 0
        ) {

            ctx.fillText(
                line,
                x,
                y
            );

            line = words[n] + " ";

            y += lineHeight;

        } else {

            line = testLine;
        }
    }

    ctx.fillText(
        line,
        x,
        y
    );

    shareBtn.addEventListener("click", async () => {

    if (!navigator.share) {
        alert("Sharing is not supported on this browser.");
        return;
    }

    canvas.toBlob(async (blob) => {

        const file = new File(
            [blob],
            "gck-flyer.png",
            { type: "image/png" }
        );

        try {

            await navigator.share({
                title: "My GCK Flyer",
                text: "Check out my GCK personalized flyer!",
                files: [file]
            });

        } catch (error) {
            console.log(error);
        }

    }, "image/png");

});
}