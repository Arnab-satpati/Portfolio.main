function seter(){
    gsap.set("nav a",{y:"-100%",opacity:0});
    gsap.set("#home .down-arrow img",{opacity:0});
    gsap.set("#home svg",{opacity:0})
}

function loader(){
    //  seter()
    document.querySelectorAll(".reveal").forEach(function(elem){

        let parent = document.createElement("span");
        let child = document.createElement("span");

        parent.setAttribute('class','parent');
        child.setAttribute('class','child');

        child.innerHTML=elem.innerHTML;
        parent.appendChild(child);
        elem.innerHTML="";
        elem.appendChild(parent)
    });
}

function loaderAnimation(){

    let tl=gsap.timeline()

    .from(".child span",{
        x:150,
        duration:.6,
        stagger:.1,
        ease: Power3.easeInOut,
        opacity:.2,
    })
    .to(".parent .child",{
        y:"-110%",
        duration:.6,
        ease: Circ.easeInOut,
    })
    .to(".black",{
        height:0,
        duration:.6,
        ease: Circ.easeInOut,
    })
    .from(".green",{
        height:"60%",
        duration:.6,
        ease: Power3.easeInOut,
        onComplete: function(){
            animateHomepage();
        }
    })


}



function animateHomepage(){
    let tl =  gsap.timeline();

    tl
    .to("#home",{
        height:"100%",
        delay:-2,
        ease: Circ.easeInOut,
    })

    .to("nav a",{
        y:0,
        opacity:1,
        ease:Expo.easeInOut
    })
    .to("#home .reveal .parent .child",{
        y:0,
        stagger:.1,
        ease:Expo.easeInOut,
    })
    .to("#home img",{
        opacity:1,
        onComplete: function(){
            animatesvg()
        }
    })
}

function animatesvg(){
    document.querySelectorAll('#Visual>g').forEach(function(e){
        let character = e.childNodes[1].childNodes[1];
        character.style.strokeDasharray=character.getTotalLength() + 'px';
        character.style.strokeDashoffset=character.getTotalLength() + 'px';
    });
    gsap.to("svg",{
        opacity:1,
    })
    gsap.to("#Visual>g>g>path,polyline",{

        strokeDashoffset:0,
        // strokeDasharray:0,
        stagger:.3,
        duration:1.2,
        ease: Power3.easeInOut,
    })
}

function loco(){
    const scroll = new LocomotiveScroll({
        el: document.querySelector('#main'),
        smooth: true,
        multiplier: 1,
        class: 'is-inview',
        getDirection: true,
        getSpeed: true,
        reloadOnContextChange: true,
        lerp: 0.05 // Lower values create smoother scrolling
    });

    // Update scroll on window resize
    window.addEventListener('resize', () => {
        scroll.update();
    });

    // Return the scroll instance so we can use it elsewhere if needed
    return scroll;
}
// Initialize variables
let locoScroll;

// DOM ready function
document.addEventListener('DOMContentLoaded', function() {
    loader();
    seter();
    loaderAnimation();

    // Initialize locomotive scroll
    locoScroll = loco();

    // Update locomotive scroll after all images are loaded
    window.addEventListener('load', function() {
        locoScroll.update();
    });
});
