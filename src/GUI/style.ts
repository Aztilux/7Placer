export const trackercss = {
    top: '0px', 
    left: '0px', 
    borderColor: 'rgb(138,43,226)', 
    color: 'rgb(138,43,226)', 
    backgroundColor: 'black', 
    opacity: '60%', 
    display: 'none', 
    transition: 'all 0.06s ease-in-out', 
    pointerEvents: 'none'
}

// design by 0vc4
export const drop = {
    width: 'calc(100% - 2em)', 
    height: 'calc(100% - 2em)', 
    position: 'fixed',
    left: '0px',
    top: '0px',
    backgroundColor: 'rgba(0, 0, 0, 0.533)',
    zIndex: '9999-',
    display: 'flex',
    color: 'white',
    fontSize: '48pt',
    justifyContent: 'center',
    alignItems: 'center',
    border: '3px white dashed',
    borderRadius: '18px',
    margin: '1em',
}

export const canvascss = { 
    position: 'absolute', 
    pointerEvents: 'none', 
    left: '0px', 
    top:'0px', 
    imageRendering: 'pixelated',
    opacity: '50%',
    animation: 'blink 3s ease-out infinite'
}

const blink = document.createElement("style");
blink.type = "text/css";
blink.innerText = `
@keyframes blink {
  0% { opacity: .30; }
  50% { opacity: .10; }
  100% { opacity: .30; }
}`;
document.head.appendChild(blink);