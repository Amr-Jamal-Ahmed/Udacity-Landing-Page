// global variables
const pageHeader= document.querySelector("body > .page__header");

let pageHeaderHeight= pageHeader.getBoundingClientRect().height;

const spyOnElement= document.querySelector("body > main");

const sectionOffsetTop= 100;

// this global variable for store setTimeout id for toggleClassInScrollLimit function 
let toggleClassInScrollLimitFuncId= null;

// helper functions
const isEleInView= ( ele,sectionOffsetTop )=> {

    if( (ele.getBoundingClientRect().top <= sectionOffsetTop) &&
        (ele.getBoundingClientRect().top * -1) <= ele.getBoundingClientRect().height) 
    {
        return 1;
    }

    return 0;
};

/*
@description : this function for toggle specific class when scrolling reach specific limit
*/
const toggleClassInScrollLimit= ( targetEle, eleClass , scrollLimit )=> {         
    scrollLimit= ( scrollLimit=== "selfHeight" )? targetEle.getBoundingClientRect().height : scrollLimit;
        
    if(window.scrollY > scrollLimit) {
        targetEle.classList.add(`${eleClass}`);
    }
    else {
        targetEle.classList.remove(`${eleClass}`);
    }
};

const toggleActiveClassOnTabs= (e)=> {
    if( Navbar.activeTabLink !== null && Navbar.activeTabLink !== e.currentTarget ) {
        Navbar.activeTabLink.classList.remove("active-link");
    }

    e.currentTarget.classList.add("active-link");

    Navbar.activeTabLink= e.currentTarget;

    document.querySelector(`${Navbar.activeTabLink.hash}`).scrollIntoView({behavior: "smooth",block: "center"});
};

/*
@description :  this function for handle navbar on scrolling which voke callback function 
                that is function hide navbar after 2 sec from user scrolling 
*/
const handlePageHeaderVisibility= ( header , cbFunc)=> {
    header.classList.toggle("hide",false);

    (toggleClassInScrollLimitFuncId)? clearTimeout(toggleClassInScrollLimitFuncId) : ""; 

    toggleClassInScrollLimitFuncId= setTimeout(()=> cbFunc(header,"hide","selfHeight"),2000);
};

const handlePageHeaderVisibilityOnscroll= (e)=> {
    handlePageHeaderVisibility(pageHeader,toggleClassInScrollLimit);
};

const handleTracking= (spyOnElement,spyElement,fadeInEle)=> {
    Array.from(spyElement.children).forEach( ele=> {
        const navbarTabLink= ele.firstElementChild;

        if( navbarTabLink.href.includes(fadeInEle.id) && fadeInEle.id) {
            document.querySelector(".active-link")?.classList.remove("active-link");
            
            navbarTabLink.classList.add("active-link");
            
            document.getElementById(`${fadeInEle.id}`)?.classList.add("active-section");
        }
        else {
            navbarTabLink.classList.remove("active-link");
        }
    });

    Array.from(spyOnElement.children).forEach( ele=> {  
        if( ele !== fadeInEle ) {
            ele.classList.remove("active-section");  
        }
    });
};

/*
@description : this function for tracking scrollbar to configure which section in the view
@params :   this function take four params and the one is for taking section above offset if thers is 
            and the two for select which element you want spy on it's children 
            and the three for select why element do spying 
            and the four is callback function for handle tracking 
*/
const trackScrollbar= (sectionOffsetTop , spyOnElement , spyElement , cbFunc)=> { 
    Array.from(spyOnElement.children).forEach( (ele , i , arr)=> {
        if(i < arr.length - 1) {
            if( isEleInView(ele,sectionOffsetTop) && !isEleInView(arr[i+1],sectionOffsetTop) ) {   
                cbFunc(spyOnElement,spyElement,ele);
            }
        }
        else {
            if( isEleInView(ele,sectionOffsetTop) ) {   
                cbFunc(spyOnElement,spyElement,ele);
            }
        }
    });
};

const handleTrackScrollbarOnscroll = (e)=> trackScrollbar(sectionOffsetTop,spyOnElement,Navbar.navbarList,handleTracking);

/* This lines of codes For Handling pageHeader Visiability When User Mouseover On Navbar Header {*/
//This Function For Stop Execution Of hideIFScrollStoped Function If IT's Hired
const stopExecution= (e)=> {
    e.stopPropagation();

    if(toggleClassInScrollLimitFuncId) {
        clearTimeout(toggleClassInScrollLimitFuncId);
    }
}

const showPageHeader= (e)=> {
    e.stopPropagation();

    if(window.scrollY > 0 && e.clientY <= pageHeaderHeight) {
        pageHeader.classList.toggle("hide",false);
    }
}
/* }*/

const toggleExpandClass= e=> {
    const targetEleId= e.currentTarget.dataset.target;
    
    document.getElementById(`${targetEleId}`).classList.toggle("expand");
};

const toggleActiveClass= e=> {
    e.currentTarget.classList.toggle("active");
}

const addActiveClass= e=> {
    e.currentTarget.classList.add("active");
}

const removeActiveClass= e=> {
    e.currentTarget.classList.remove("active");
}

// main classes
class Navbar {
    static navbarList= document.querySelector("#navbar__list");

    static activeTabLink= null;

    handleTabLinksOnclick (...callbacks) { 
        for(const ele of Navbar.navbarList.children) {
            const tabLink = ele.firstElementChild;

            tabLink.addEventListener("click", e=> {
                e.stopPropagation();
                e.preventDefault();

                callbacks.forEach(cb=> (typeof cb=== "function")? cb(e) : "");
            });
        } 
    } 

    handleNavbarLogoOnclick(logo) {
        function handleNavbarLogo(e){
            e.stopPropagation();
            e.preventDefault();

            window.scrollTo(0,0);

            const firstEleInTracking = spyOnElement.firstElementChild;

            if(!firstEleInTracking.classList.contains("active-section")) {
                document.querySelector(".active-link")?.classList.remove("active-link");
            }
        }

        logo.addEventListener("click",handleNavbarLogo);
    }

    renderNavbarTab ( sectionId ,text , activeClass= null) {
        const navbarTabLink= document.createElement("a");

        navbarTabLink.setAttribute("href",`#${sectionId}`);

        navbarTabLink.setAttribute("alt","navbar tab");

        navbarTabLink.setAttribute("class",`menu__link ${( activeClass != null )? activeClass : ""}`);

        navbarTabLink.textContent= `${text}`;

        navbarTabLink.addEventListener("click",Navbar.handleNavbarTabLink);

        const li= document.createElement("li");

        li.appendChild( navbarTabLink );

        return li ;
    }
}

class ScrollToTopBtn {
    static scrollToTopBtn = null;

    handlescrollToTopBtnOnclick( e ) {
        e.stopPropagation();

        document.documentElement.style.scrollBehavior = "smooth";
        
        setTimeout(e=> window.scrollTo(0,0),0);
        
        setTimeout(e=>  document.documentElement.style.scrollBehavior = "initial",0);
    }
    
    handlescrollToTopBtnVisibilityOnscroll(btn,cbFunc) {
        cbFunc(btn,"show",40);  
    }

    renderscrollToTopBtn( icon , text=null) {   
        const scrollToTopBtn= document.createElement("a");

        scrollToTopBtn.innerHTML += (icon)? icon : "";

        scrollToTopBtn.innerHTML += (text)? text : "";
        
        scrollToTopBtn.setAttribute("class","page__scroll-to-top-btn");

        return scrollToTopBtn;
    }
}

// main function
const main= ()=> {
    // start coding for NavbarTabs {
    const sections= document.querySelectorAll("body main section");

    const virtualDomEle= document.createDocumentFragment();
    
    const navbar= new Navbar();
    
    sections.forEach( ( ele , i )=> {
        virtualDomEle.appendChild( navbar.renderNavbarTab( ele.id , ele.dataset.nav ) );
    });
    
    Navbar.navbarList.appendChild( virtualDomEle );

    navbar.handleTabLinksOnclick( toggleActiveClassOnTabs );
    // }

    // start coding for navbarLogo {
        const navbarLogo = document.querySelector(".navbar__logo");

        navbar.handleNavbarLogoOnclick(navbarLogo);
    // }

    // start coding for pageHeader {
    // I'm reevalute pageHeaderHeight variable becuse the pageHeader height change after adding tabs in it
    pageHeaderHeight= pageHeader.getBoundingClientRect().height;

    window.addEventListener("scroll" , handlePageHeaderVisibilityOnscroll);

    window.addEventListener("scroll" , handleTrackScrollbarOnscroll);

    pageHeader.addEventListener("mouseover",stopExecution);

    // this line for for revoke handlePageHeaderVisibilityOnscroll function when user move away from it
    pageHeader.addEventListener("mouseout",handlePageHeaderVisibilityOnscroll);
    
    window.addEventListener("mousemove",showPageHeader);
    //}

    // start coding for navbarDropdownTogglerBtn {
    const navbarDropdownTogglerBtn= document.querySelector(".navbar__dropdown-toggler");

    navbarDropdownTogglerBtn.addEventListener("mousedown",addActiveClass);

    navbarDropdownTogglerBtn.addEventListener("mouseup",removeActiveClass);

    navbarDropdownTogglerBtn.addEventListener("click",toggleExpandClass);
    //}

    // start coding for scrollToTopBtn {
    const scrollToTopBtnObj= new ScrollToTopBtn();

    const scrollToTopBtn= scrollToTopBtnObj.renderscrollToTopBtn(`<i class="fa-solid fa-arrow-up"></i>`);

    document.body.appendChild(scrollToTopBtn);

    scrollToTopBtn.addEventListener("click",scrollToTopBtnObj.handlescrollToTopBtnOnclick);

    const handlescrollToTopBtnVisibilityOnscroll= (e)=> {
        e.stopPropagation();

        scrollToTopBtnObj.handlescrollToTopBtnVisibilityOnscroll(scrollToTopBtn,toggleClassInScrollLimit);
    };

    window.addEventListener("scroll",handlescrollToTopBtnVisibilityOnscroll);
    //}
};
main();