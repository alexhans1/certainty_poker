import backgroundImage1 from "../../../assets/landing-page-image-1.webp"
import backgroundImage2 from "../../../assets/landing-page-image-2.webp"
import backgroundImage3 from "../../../assets/landing-page-image-3.webp"
import backgroundImage4 from "../../../assets/landing-page-image-4.webp"
import backgroundImagePhone from "../../../assets/landing-page-image-phone.webp"

export default function PictureHalf() {
  return (
    <div className="grid grid-cols-3 gap-4 grid-flow-row-dense py-4 md:pb-12 h-full relative lg:overflow-hidden">
      <div className="col-span-2 row-span-3 rounded-lg flex justify-center items-center p-5 bg-beige">
        <img src={backgroundImage3} className="rounded-xl" alt="background" />
      </div>
      <div className="col-span-1 row-span-2 rounded-lg flex justify-center items-center p-5 bg-beige">
        <img src={backgroundImage4} className="rounded-xl" alt="background" />
      </div>
      <div className="col-span-2 row-span-3 rounded-lg flex justify-center items-center p-5 bg-beige">
        <img src={backgroundImage1} className="rounded-xl" alt="background" />
      </div>
      <div className="col-span-1 row-span-5 rounded-tl-lg rounded-br-full flex justify-center items-center p-5 bg-blue-200" />
      <div className="col-span-2 row-span-2 overflow-hidden rounded-lg flex justify-center items-center p-5 bg-beige">
        <img src={backgroundImage2} className="rounded-xl" alt="background" />
      </div>

      <div className="absolute rounded-2xl h-3/4 w-2/3 self-center justify-self-center flex justify-center">
        <img
          src={backgroundImagePhone}
          className="rounded-xl h-full"
          alt="background"
        />
      </div>
    </div>
  )
}
