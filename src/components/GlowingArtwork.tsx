import React from "react";

interface GlowingArtworkProps {
  isBackground?: boolean;
}

export default function GlowingArtwork({ isBackground = false }: GlowingArtworkProps) {
  return (
    <div className="glow-art-scale-wrapper">
      {/* Dynamic isolated style tag to preserve exact visual characteristics without contaminating global files */}
      <style>{`
        .glow-art-scale-wrapper {
          display: flex;
          justify-content: center;
          align-items: center;
          width: 100%;
          overflow: hidden;
          ${isBackground 
            ? 'position: absolute; inset: 0; height: 100%; z-index: 0; pointer-events: none; border: none; opacity: 0.93;' 
            : 'height: 540px; position: relative; background: #020617; border-top: 1px solid #0f172a; border-bottom: 1px solid #0f172a;'
          }
        }

        .glow-art-container {
          position: relative;
          width: 1200px;
          height: 700px;
          flex-shrink: 0;
          margin: 0 auto;
          /* Adjusted offset top so the baseline of the houses sits elegantly above the container floor */
          padding-top: 140px;
          transform-origin: center center;
        }

        /* Responsive transform scale factors to fit any viewports */
        @media (max-width: 1280px) {
          .glow-art-container {
            transform: scale(0.8);
          }
          ${!isBackground ? `
          .glow-art-scale-wrapper {
            height: 460px;
          }
          ` : ''}
        }
        @media (max-width: 991px) {
          .glow-art-container {
            transform: scale(0.6);
          }
          ${!isBackground ? `
          .glow-art-scale-wrapper {
            height: 360px;
          }
          ` : ''}
        }
        @media (max-width: 768px) {
          .glow-art-container {
            transform: scale(0.48);
          }
          ${!isBackground ? `
          .glow-art-scale-wrapper {
            height: 300px;
          }
          ` : ''}
        }
        @media (max-width: 575px) {
          .glow-art-container {
            transform: scale(0.35);
          }
          ${!isBackground ? `
          .glow-art-scale-wrapper {
            height: 220px;
          }
          ` : ''}
        }
        @media (max-width: 400px) {
          .glow-art-container {
            transform: scale(0.28);
          }
          ${!isBackground ? `
          .glow-art-scale-wrapper {
            height: 180px;
          }
          ` : ''}
        }

        .glow-art-container .sol {
          position: absolute;
          width: 90px;
          height: 90px;
          border-radius: 100%;
          border: 2px solid rgba(248, 241, 75, 1);
          -webkit-box-shadow: 0 0 30px 3px rgba(248, 241, 75, .3);
          -moz-box-shadow: 0 0 30px 3px rgba(248, 241, 75, .3);
          box-shadow: 0 0 30px 3px rgba(248, 241, 75, .3);
          margin: 50px 212px;
        }

        .glow-art-container .casa {
          position: absolute;
          width: 152px;
          height: 132px;
          margin: 312px 281px;
          border: 2px solid rgba(251, 94, 55, 1);
          -webkit-box-shadow: 0 0 21px 3px rgba(251, 94, 55, .5);
          -moz-box-shadow: 0 0 21px 3px rgba(251, 94, 55, .5);
          box-shadow: 0 0 21px 3px rgba(251, 94, 55, .5);
        }

        .glow-art-container .casa::before {
          content: "";
          display: block;
          width: 0;
          height: 172px;
          border: 1px solid rgba(255, 251, 0, 1);
          -webkit-box-shadow: 0 0 21px 3px rgba(255, 251, 0, .3);
          -moz-box-shadow: 0 0 21px 3px rgba(255, 251, 0, .3);
          box-shadow: 0 0 21px 3px rgba(255, 251, 0, .3);
          margin: -112px 5px;
          transform: rotate(55deg);
          -moz-transform: rotate(55deg);
          -webkit-transform: rotate(55deg);
          -o-transform: rotate(55deg);
          -ms-transform: rotate(55deg);
        }

        .glow-art-container .casa::after {
          content: "";
          display: block;
          width: 0;
          height: 172px;
          border: 1px solid rgba(255, 251, 0, 1);
          -webkit-box-shadow: 0 0 21px 3px rgba(255, 251, 0, .3);
          -moz-box-shadow: 0 0 21px 3px rgba(255, 251, 0, .3);
          box-shadow: 0 0 21px 3px rgba(255, 251, 0, .3);
          margin: -333px 147px;
          transform: rotate(-55deg);
          -moz-transform: rotate(-55deg);
          -webkit-transform: rotate(-55deg);
          -o-transform: rotate(-55deg);
          -ms-transform: rotate(-55deg);
        }

        .glow-art-container ul.v1 {
          display: block;
          width: 112px;
          height: 132px;
          list-style: none;
          margin: 70px -19px;
          padding: 0;
        }

        .glow-art-container ul.v1 li {
          display: inline-block;
          width: 30px;
          height: 30px;
          border: 2px solid rgba(255, 251, 0, 1);
          -webkit-box-shadow: 0 0 21px 3px rgba(255, 251, 0, .3);
          -moz-box-shadow: 0 0 21px 3px rgba(255, 251, 0, .3);
          box-shadow: 0 0 21px 3px rgba(255, 251, 0, .3);
          margin: 5px 0px;
        }

        .glow-art-container .casa3 {
          position: absolute;
          width: 192px;
          height: 172px;
          background: #220011;
          margin: 271px 512px;
          border: 2px solid rgba(40, 251, 255, 1);
          -webkit-box-shadow: 0 0 21px 3px rgba(40, 251, 255, .5);
          -moz-box-shadow: 0 0 21px 3px rgba(40, 251, 255, .5);
          box-shadow: 0 0 21px 3px rgba(40, 251, 255, .5);
        }

        .glow-art-container .casa3::before {
          content: "";
          display: block;
          width: 0;
          height: 212px;
          border: 1px solid rgba(255, 21, 255, 1);
          -webkit-box-shadow: 0 0 21px 3px rgba(255, 21, 255, .3);
          -moz-box-shadow: 0 0 21px 3px rgba(255, 21, 255, .3);
          box-shadow: 0 0 21px 3px rgba(255, 21, 255, .3);
          margin: -142px 9px;
          transform: rotate(55deg);
          -moz-transform: rotate(55deg);
          -webkit-transform: rotate(55deg);
          -o-transform: rotate(55deg);
          -ms-transform: rotate(55deg);
        }

        .glow-art-container .casa3::after {
          content: "";
          display: block;
          width: 0;
          height: 212px;
          border: 1px solid rgba(255, 21, 255, 1);
          -webkit-box-shadow: 0 0 21px 3px rgba(255, 21, 255, .3);
          -moz-box-shadow: 0 0 21px 3px rgba(255, 21, 255, .3);
          box-shadow: 0 0 21px 3px rgba(255, 21, 255, .3);
          margin: -427px 183px;
          transform: rotate(-55deg);
          -moz-transform: rotate(-55deg);
          -webkit-transform: rotate(-55deg);
          -o-transform: rotate(-55deg);
          -ms-transform: rotate(-55deg);
        }

        .glow-art-container ul.v2 {
          display: block;
          width: 192px;
          height: 132px;
          list-style: none;
          margin: 112px -30px;
          padding: 0;
        }

        .glow-art-container ul.v2 li {
          display: inline-block;
          width: 30px;
          height: 30px;
          border: 2px solid rgba(255, 21, 255, 1);
          -webkit-box-shadow: 0 0 21px 3px rgba(255, 21, 255, .3);
          -moz-box-shadow: 0 0 21px 3px rgba(255, 21, 255, .3);
          box-shadow: 0 0 21px 3px rgba(255, 21, 255, .3);
          margin: 5px 3px;
        }

        .glow-art-container .casa6 {
          position: absolute;
          width: 152px;
          height: 132px;
          margin: 312px 780px;
          border: 2px solid rgba(255, 0, 102, 1);
          -webkit-box-shadow: 0 0 21px 3px rgba(255, 0, 102, .5);
          -moz-box-shadow: 0 0 21px 3px rgba(255, 0, 102, .5);
          box-shadow: 0 0 21px 3px rgba(255, 0, 102, .5);
        }

        .glow-art-container .casa6::before {
          content: "";
          display: block;
          width: 0;
          height: 172px;
          border: 1px solid rgba(0, 247, 152, 1);
          box-shadow: 0 0 21px 3px rgba(0, 247, 152, .3);
          -webkit-box-shadow: 0 0 21px 3px rgba(0, 247, 152, .3);
          -moz-box-shadow: 0 0 21px 3px rgba(0, 247, 152, .3);
          margin: -112px 5px;
          transform: rotate(55deg);
          -moz-transform: rotate(55deg);
          -webkit-transform: rotate(55deg);
          -o-transform: rotate(55deg);
          -ms-transform: rotate(55deg);
        }

        .glow-art-container .casa6::after {
          content: "";
          display: block;
          width: 0;
          height: 172px;
          border: 1px solid rgba(0, 247, 152, 1);
          box-shadow: 0 0 21px 3px rgba(0, 247, 152, .3);
          -webkit-box-shadow: 0 0 21px 3px rgba(0, 247, 152, .3);
          -moz-box-shadow: 0 0 21px 3px rgba(0, 247, 152, .3);
          margin: -333px 147px;
          transform: rotate(-55deg);
          -moz-transform: rotate(-55deg);
          -webkit-transform: rotate(-55deg);
          -o-transform: rotate(-55deg);
          -ms-transform: rotate(-55deg);
        }

        .glow-art-container ul.v3 {
          display: block;
          width: 112px;
          height: 132px;
          list-style: none;
          margin: 70px -19px;
          padding: 0;
        }

        .glow-art-container ul.v3 li {
          display: inline-block;
          width: 30px;
          height: 30px;
          border: 2px solid rgba(0, 247, 152, 1);
          box-shadow: 0 0 21px 3px rgba(0, 247, 152, .3);
          -webkit-box-shadow: 0 0 21px 3px rgba(0, 247, 152, .3);
          -moz-box-shadow: 0 0 21px 3px rgba(0, 247, 152, .3);
          margin: 5px 0px;
        }

        .glow-art-container .base {
          position: relative;
          width: 900px;
          height: 0px;
          margin: 450px auto;
          border: 1px solid rgba(187, 241, 55, 1);
          box-shadow: 0 0 12px 3px rgba(187, 241, 55, .3);
          -webkit-box-shadow: 0 0 12px 3px rgba(187, 241, 55, .3);
          -moz-box-shadow: 0 0 12px 3px rgba(187, 241, 55, .3);
        }

        .glow-art-container .chi {
          position: absolute;
          width: 30px;
          height: 50px;
          border: 1px solid rgba(255, 21, 255, 1);
          box-shadow: 0 0 12px 3px rgba(255, 21, 255, .3);
          -webkit-box-shadow: 0 0 12px 3px rgba(255, 21, 255, .3);
          -moz-box-shadow: 0 0 12px 3px rgba(255, 21, 255, .3);
          margin: 192px 670px;
        }

        .glow-art-container .chi::before {
          content: "";
          display: block;
          width: 43px;
          height: 12px;
          border: 1px solid rgba(255, 21, 255, 1);
          box-shadow: 0 0 21px 3px rgba(255, 21, 255, .3);
          -webkit-box-shadow: 0 0 21px 3px rgba(255, 21, 255, .3);
          -moz-box-shadow: 0 0 21px 3px rgba(255, 21, 255, .3);
          margin: -14px -7px;
        }

        .glow-art-container .hu {
          position: absolute;
          width: 30px;
          height: 14px;
          border-radius: 0px 0px 30px 30px;
          border-bottom: 2px solid rgba(213, 255, 75, 1);
          border-right: 2px solid rgba(213, 255, 75, 1);
          border-left: 2px solid rgba(213, 255, 75, 1);
          margin: 132px 660px;
          -moz-animation: huu 3s alternate infinite;
          -webkit-animation: huu 3s alternate infinite;
          -o-animation: huu 3s alternate infinite;
          animation: huu 3s alternate infinite;
        }

        .glow-art-container .hu::before {
          content: "";
          display: block;
          width: 21px;
          height: 12px;
          border-radius: 0px 0px 30px 30px;
          border-bottom: 2px solid rgba(213, 255, 75, 1);
          border-right: 2px solid rgba(213, 255, 75, 1);
          border-left: 2px solid rgba(213, 255, 75, 1);
          margin: -9px 30px;
          -moz-animation: huu3 3.1s alternate infinite;
          -webkit-animation: huu3 3.1s alternate infinite;
          -o-animation: huu3 3.1s alternate infinite;
          animation: huu3 3.1s alternate infinite; /* fixed typo: alernate to alternate */
        }

        .glow-art-container .hu::after {
          content: "";
          display: block;
          width: 21px;
          height: 12px;
          border-radius: 0px 0px 30px 30px;
          border-bottom: 2px solid rgba(213, 255, 75, 1);
          border-right: 2px solid rgba(213, 255, 75, 1);
          border-left: 2px solid rgba(213, 255, 75, 1);
          margin: -30px 3px;
          -moz-animation: huu6 3.2s alternate infinite;
          -webkit-animation: huu6 3.2s alternate infinite;
          -o-animation: huu6 3.2s alternate infinite;
          animation: huu6 3.2s alternate infinite;
        }

        .glow-art-container .cat {
          position: absolute;
          width: 21px;
          height: 17px;
          border-radius: 100%;
          margin: 201px 345px;
          border: 1px solid rgba(255, 255, 255, 1);
          box-shadow: 0 0 12px 3px rgba(255, 255, 255, .3);
          -webkit-box-shadow: 0 0 12px 3px rgba(255, 255, 255, .3);
          -moz-box-shadow: 0 0 12px 3px rgba(255, 255, 255, .3); /* fixed typo: rgbargba to rgba */
        }

        .glow-art-container .cat::before {
          content: "";
          display: block;
          width: 23px;
          height: 19px;
          border-radius: 100%;
          border: 2px solid rgba(255, 255, 255, 1);
          box-shadow: 0 0 12px 3px rgba(255, 255, 255, .3);
          -webkit-box-shadow: 0 0 12px 3px rgba(255, 255, 255, .3);
          -moz-box-shadow: 0 0 12px 3px rgba(255, 255, 255, .3); /* fixed typo: rgbargba to rgba */
          margin: 16px -3px;
        }

        .glow-art-container .orejas {
          position: absolute;
          width: 0;
          height: 0;
          border-left: 5px solid transparent;
          border-right: 5px solid transparent;
          border-bottom: 12px solid white;
          margin: -65px 14px;
          transform: rotate(25deg);
          -moz-transform: rotate(25deg);
          -webkit-transform: rotate(25deg);
          -o-transform: rotate(25deg);
          -ms-transform: rotate(25deg);
        }

        .glow-art-container .orejas::before {
          content: "";
          display: block;
          width: 0;
          height: 0;
          border-left: 5px solid transparent;
          border-right: 5px solid transparent;
          border-bottom: 12px solid white;
          margin: 7px -21px;
          transform: rotate(-53deg);
          -moz-transform: rotate(-53deg);
          -webkit-transform: rotate(-53deg);
          -o-transform: rotate(-53deg);
          -ms-transform: rotate(-53deg);
        }

        .glow-art-container .orejas::after {
          content: "";
          display: block;
          width: 21px;
          height: 12px;
          border-radius: 0px 0px 30px 30px;
          border-bottom: 2px solid rgba(255, 255, 255, 1);
          border-right: 2px solid rgba(255, 255, 255, 1);
          border-left: 2px solid rgba(255, 255, 255, 1);
          border-color: rgba(255, 255, 255, 1);
          margin: 30px 9px;
          -moz-animation: col 3s alternate infinite;
          -webkit-animation: col 3s alternate infinite;
          -o-animation: col 3s alternate infinite;
          animation: col 3s alternate infinite;
        }

        .glow-art-container .birds {
          position: absolute;
          width: 12px;
          height: 6px;
          opacity: 1;
          border-radius: 0 0 30px 30px;
          border-bottom: 2px solid rgba(0, 231, 255, 1);
          border-right: 2px solid rgba(0, 231, 255, 1);
          border-left: 2px solid rgba(0, 231, 255, 1);
          margin: 152px 375px;
          -moz-animation: vuela 2s alternate infinite;
          -webkit-animation: vuela 2s alternate infinite;
          -o-animation: vuela 2s alternate infinite;
          animation: vuela 2s alternate infinite;
        }

        .glow-art-container .birds::before {
          content: "";
          display: block;
          width: 12px;
          height: 6px;
          border-radius: 0px 0px 30px 30px;
          border-bottom: 2px solid rgba(0, 231, 255, 1);
          border-right: 2px solid rgba(0, 231, 255, 1);
          border-left: 2px solid rgba(0, 231, 255, 1);
          margin: 0px 12px;
        }

        .glow-art-container .birds3 {
          position: absolute;
          width: 12px;
          height: 6px;
          opacity: 0;
          border-radius: 30px 30px 0 0;
          border-top: 2px solid rgba(0, 231, 255, 1);
          border-right: 2px solid rgba(0, 231, 255, 1);
          border-left: 2px solid rgba(0, 231, 255, 1);
          margin: 152px 375px;
          -moz-animation: vuela3 2s alternate infinite;
          -webkit-animation: vuela3 2s alternate infinite;
          -o-animation: vuela3 2s alternate infinite;
          animation: vuela3 2s alternate infinite;
        }

        .glow-art-container .birds3::before {
          content: "";
          display: block;
          width: 12px;
          height: 6px;
          border-radius: 30px 30px 0 0;
          border-top: 2px solid rgba(0, 231, 255, 1);
          border-right: 2px solid rgba(0, 231, 255, 1);
          border-left: 2px solid rgba(0, 231, 255, 1);
          margin: 0px 12px;
        }

        .glow-art-container .birds4 {
          position: absolute;
          width: 12px;
          height: 6px;
          opacity: 1;
          border-radius: 0 0 30px 30px;
          border-bottom: 2px solid rgba(255, 91, 132, 1);
          border-right: 2px solid rgba(255, 91, 132, 1);
          border-left: 2px solid rgba(255, 91, 132, 1);
          margin: 132px 385px;
          -moz-animation: vuela 2s alternate infinite;
          -webkit-animation: vuela 2s alternate infinite;
          -o-animation: vuela 2s alternate infinite;
          animation: vuela 2s alternate infinite;
        }

        .glow-art-container .birds4::before {
          content: "";
          display: block;
          width: 12px;
          height: 6px;
          border-radius: 0px 0px 30px 30px;
          border-bottom: 2px solid rgba(255, 91, 132, 1);
          border-right: 2px solid rgba(255, 91, 132, 1);
          border-left: 2px solid rgba(255, 91, 132, 1);
          margin: 0px 12px;
        }

        .glow-art-container .birds5 {
          position: absolute;
          width: 12px;
          height: 6px;
          opacity: 0;
          border-radius: 30px 30px 0 0;
          border-top: 2px solid rgba(255, 91, 132, 1);
          border-right: 2px solid rgba(255, 91, 132, 1);
          border-left: 2px solid rgba(255, 91, 132, 1);
          margin: 132px 395px;
          -moz-animation: vuela3 2s alternate infinite;
          -webkit-animation: vuela3 2s alternate infinite;
          -o-animation: vuela3 2s alternate infinite;
          animation: vuela3 2s alternate infinite;
        }

        .glow-art-container .birds5::before {
          content: "";
          display: block;
          width: 12px;
          height: 6px;
          border-radius: 30px 30px 0 0;
          border-top: 2px solid rgba(255, 91, 132, 1);
          border-right: 2px solid rgba(255, 91, 132, 1);
          border-left: 2px solid rgba(255, 91, 132, 1);
          margin: 0px 12px;
        }

        .glow-art-container .arboles {
          position: absolute;
          width: 12px;
          height: 21px;
          border: 2px solid rgba(162, 57, 0, 1);
          box-shadow: 0 0 12px 3px rgba(162, 57, 0, .3);
          -webkit-box-shadow: 0 0 12px 3px rgba(162, 57, 0, .3);
          -moz-box-shadow: 0 0 12px 3px rgba(162, 57, 0, .3);
          margin: 425px 192px;
        }

        .glow-art-container .arboles::before {
          content: "";
          display: block;
          width: 50px;
          height: 40px;
          border-radius: 100%;
          border: 2px solid rgba(162, 228, 0, 1);
          box-shadow: 0 0 12px 3px rgba(162, 228, 0, .3);
          -webkit-box-shadow: 0 0 12px 3px rgba(162, 228, 0, .3);
          -moz-box-shadow: 0 0 12px 3px rgba(162, 228, 0, .3);
          margin: -45px -21px;
        }

        .glow-art-container .arboles3 {
          position: absolute;
          width: 12px;
          height: 21px;
          border: 2px solid rgba(162, 57, 0, 1);
          box-shadow: 0 0 12px 3px rgba(162, 57, 0, .3);
          -webkit-box-shadow: 0 0 12px 3px rgba(162, 57, 0, .3);
          -moz-box-shadow: 0 0 12px 3px rgba(162, 57, 0, .3);
          margin: 425px 995px;
        }

        .glow-art-container .arboles3::before {
          content: "";
          display: block;
          width: 50px;
          height: 40px;
          border-radius: 100%;
          border: 2px solid rgba(162, 228, 0, 1);
          box-shadow: 0 0 12px 3px rgba(162, 228, 0, .3);
          -webkit-box-shadow: 0 0 12px 3px rgba(162, 228, 0, .3);
          -moz-box-shadow: 0 0 12px 3px rgba(162, 228, 0, .3);
          margin: -45px -21px;
        }

        @keyframes huu {
          0%, 25% {
            border-bottom: 2px solid #212121;
            border-right: 2px solid #212121;
            border-left: 2px solid #212121;
            border-color: #212121;
          }
          50%, 75%, 100% {
            border-bottom: 2px solid rgba(213, 255, 75, 1);
            border-right: 2px solid rgba(213, 255, 75, 1);
            border-left: 2px solid rgba(213, 255, 75, 1);
            border-color: rgba(213, 255, 75, 1);
          }
        }

        @keyframes huu3 {
          0%, 25% {
            border-bottom: 2px solid #212121;
            border-right: 2px solid #212121;
            border-left: 2px solid #212121;
            border-color: #212121;
          }
          50%, 75%, 100% {
            border-bottom: 2px solid rgba(213, 255, 75, 1);
            border-right: 2px solid rgba(213, 255, 75, 1);
            border-left: 2px solid rgba(213, 255, 75, 1);
            border-color: rgba(213, 255, 75, 1);
          }
        }

        @keyframes huu6 {
          0%, 25% {
            border-bottom: 2px solid #212121;
            border-right: 2px solid #212121;
            border-left: 2px solid #212121;
            border-color: #212121;
          }
          50%, 75%, 100% {
            border-bottom: 2px solid rgba(213, 255, 75, 1);
            border-right: 2px solid rgba(213, 255, 75, 1);
            border-left: 2px solid rgba(213, 255, 75, 1);
            border-color: rgba(213, 255, 75, 1);
          }
        }

        @keyframes col {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(5deg);
            margin: 23px 12px;
          }
        }

        @keyframes vuela {
          0%, 25% {
            opacity: 1;
          }
          50%, 100% {
            opacity: 0;
          }
        }

        @keyframes vuela3 {
          0%, 25% {
            opacity: 0;
          }
          50%, 100% {
            opacity: 1;
          }
        }
      `}</style>

      {/* Main landscape viewport */}
      <div className="glow-art-container" id="glowing-art-scene">
        <div className="sol"></div>
        
        <div className="casa">
          <ul className="v1">
            <li></li>
            <li></li>
            <li></li>
            <li></li>
            <li></li>
            <li></li>
          </ul>
        </div>
        
        <div className="casa3">
          <ul className="v2">
            <li></li>
            <li></li>
            <li></li>
            <li></li>
            <li></li>
            <li></li>
            <li></li>
            <li></li>
          </ul>
        </div>
        
        <div className="casa6">
          <ul className="v3">
            <li></li>
            <li></li>
            <li></li>
            <li></li>
            <li></li>
            <li></li>
          </ul>
        </div>
        
        <div className="chi"></div>
        <div className="hu"></div>
        <div className="cat">
          <div className="orejas"></div>
        </div>
        
        <div className="birds"></div>
        <div className="birds3"></div>
        <div className="birds4"></div>
        <div className="birds5"></div>
        
        <div className="arboles"></div>
        <div className="arboles3"></div>
        
        <div className="base"></div>
      </div>
    </div>
  );
}
