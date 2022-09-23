// global variables
const PAGE_HEADER = document.querySelector("body > .page__header");

let pageHeaderHeight = PAGE_HEADER.getBoundingClientRect().height;

// this global variable for store setTimeout id for toggleClassInScrollLimit function
// which using for hide pageHeader
let hidePageHeaderFuncId = null;

// helper functions
/**
 * @description - This is functionfor detect if section element in view or not
 *
 * @param {object} ele - this is param for take section element that we want check if in view or not
 * @param {Number} offsetTop - this is param for take section offset top value if there is
 */
let isEleInView = (ele, offsetTop = 0) => {
  if (
    ele.getBoundingClientRect().top <= offsetTop &&
    ele.getBoundingClientRect().top * -1 <= ele.getBoundingClientRect().height
  ) {
    return 1;
  }

  return 0;
};

/**
 * @description - This is function used for toggle active class on each tabeLink in the navbar
 *
 * @param {object} e - this is param for take event object value
 */
let toggleActiveClassOnTabs = (e) => {
  if (
    Navbar.activeTabLink !== null &&
    Navbar.activeTabLink !== e.currentTarget
  ) {
    Navbar.activeTabLink.classList.remove("active-link");
  }

  e.currentTarget.classList.add("active-link");

  Navbar.activeTabLink = e.currentTarget;

  document
    .querySelector(`${Navbar.activeTabLink.hash}`)
    .scrollIntoView({ behavior: "smooth", block: "center" });
};

/**
 * @description - This is function used for prevent execution Of hidePageHeader function
 *
 * @param {Number} setTimeoutId - This is param for take settimeoutId value for hidePageHeader function
 */
let preventFuncExecution = (setTimeoutId) => {
  if (setTimeoutId) {
    clearTimeout(setTimeoutId);
  }
};

/**
 * @description - This is function used for hide pageHeader element
 */
let hidePageHeader = (pageHeader) => {
  if (window.scrollY > 0) {
    pageHeader.classList.add("hide");
  } else {
    preventFuncExecution(hidePageHeaderFuncId);
  }
};

/**
 * @description - This is functionfor handle navbar on scrolling which voke callback function
 *              that is function hide pageHeader after 2 sec from user scrolling
 *
 * @param {object} header - this is param for take header element value
 * @param {function} cbFunc - this is param for take callback hidePageHeader function that want voke after 2 sec
 */
let handlePageHeaderVisibility = () => {
  PAGE_HEADER.classList.toggle("hide", false);

  hidePageHeaderFuncId ? clearTimeout(hidePageHeaderFuncId) : "";

  hidePageHeaderFuncId = setTimeout(
    () => hidePageHeader(PAGE_HEADER, "hide", "selfHeight"),
    2000
  );
};

/**
 * @description - This is function used for add active-section class on section that in view
 *                ,so thus will also add active-link on related navbar tab link
 *                ,also remove active-section class from prev section
 *                and also remove active-link for prev navbar tab link
 *
 * @param {object} spyOnEle - This param for take spyOnEle value that we want to track his children
 * @param {object} spyEle - This param for take spyEle value that his children are tracker
 * @param {object} fadeInEle - This is param for take specific element which in view
 */
let handleTracking = (spyEle, fadeInEle) => {
  let navbarTabLink = document.querySelector(`a[href="#${fadeInEle.id}"]`);

  document.querySelector(".active-section")?.classList.remove("active-section");

  document.querySelector(".active-link")?.classList.remove("active-link");

  // I am check if there is navbarTabLink include in his href property fadeInEle id
  // if result true that is mean that fadeInEle is we want track and related to one of navbarTabLink
  // so so add active class to fadeInEle and navbarTabLink
  if (navbarTabLink) {
    navbarTabLink.classList.add("active-link");

    fadeInEle.classList.add("active-section");
  }
};

/**
 * @description - This is functionfor tracking scrollbar to configure which section in the view
 *
 * @param {Number} sectionOffsetTop - This is param for taking section above offset if there is
 * @param {object} spyOnEle - This is param for select which element you want spy on it's children
 * @param {object} spyEle - This is param for select element which it's children is tracker
 * @param {function} cbFunc - This is param for callback handleTracking function for handle tracking
 */
let trackScrollbar = (sectionOffsetTop, spyOnEle, spyEle, cbFunc) => {
  Array.from(spyOnEle.children).forEach((ele, i, arr) => {
    if (i < arr.length - 1) {
      if (
        isEleInView(ele, sectionOffsetTop) &&
        !isEleInView(arr[i + 1], sectionOffsetTop)
      ) {
        cbFunc(spyEle, ele);
      }
    } else {
      if (isEleInView(ele, sectionOffsetTop)) {
        cbFunc(spyEle, ele);
      }
    }
  });
};

/**
 * @description - This is function used for watch or track all sections that we want track and handle it
 *
 * @param {object} e - This is param for take event obj value
 */
let watchSectionsOnScroll = (e) => {
  const SPY_ON_ELE = document.querySelector("body > main");
  const SPY_ELE = document.querySelector("#navbar__list");
  const SECTION_OFFSET_TOP = 100;

  trackScrollbar(SECTION_OFFSET_TOP, SPY_ON_ELE, SPY_ELE, handleTracking);
};

/**
 * @description - This is functionfor keep pageHeader visible when user mouse over on it
 *                which will voke preventFuncExecution func which will stop Execution of hidePageHeader func
 *
 * @param {object} e - This is param for take event obj value
 */
let keepPageHeaderVisibleOnmouseover = (e) => {
  e.stopPropagation();

  preventFuncExecution(hidePageHeaderFuncId);
};

/**
 * @description - This is function for show pageHeader ele if user mouse over on the regon
 *                that locat at the top of window where pageHeader locate
 *
 * @param {object} e - This is param for take event obj value
 */
let showPageHeader = (e) => {
  e.stopPropagation();

  if (window.scrollY > 0 && e.clientY <= pageHeaderHeight) {
    PAGE_HEADER.classList.toggle("hide", false);
  }
};

/**
 * @description - This is function used for toggle expand class on navbar dropdown ele
 * @param {object} e - This is param for take event obj value
 */
let toggleExpandClassOnNavbarDropdown = (e) => {
  const targetEleId = e.currentTarget.dataset.target;

  document.getElementById(`${targetEleId}`).classList.toggle("expand");
};

/**
 * @description - This is function used for add active class on currentTarget ele
 * @param {object} e - This is param for take event obj value
 */
let addActiveClass = (e) => {
  e.currentTarget.classList.add("active");
};

/**
 * @description - This is function used for remove active class on currentTarget ele
 * @param {object} e - This is param for take event obj value
 */
let removeActiveClass = (e) => {
  e.currentTarget.classList.remove("active");
};

/**
 * @description - This is functionfor toggle specific class when
 *                scroll value less or more than specific scroll limit
 *
 * @param {object} targetEle - this param for take specific element that we want toggle class on it
 * @param {string} eleClass - this param for take class the we want toggle
 * @param {Number} scrollLimit - this param for take scrollLimit value that
 *                          we depende on it for detect if we want add class or remove class
 */
let toggleClassInScrollLimit = (targetEle, eleClass, scrollLimit) => {
  scrollLimit =
    scrollLimit === "selfHeight"
      ? targetEle.getBoundingClientRect().height
      : scrollLimit;

  if (window.scrollY > scrollLimit) {
    targetEle.classList.add(`${eleClass}`);
  } else {
    targetEle.classList.remove(`${eleClass}`);
  }
};

/**
 * @description - This is function used for scroll to the top of page on click on navbarLogo
 *
 * @param {object} e - This is param for take event obj value
 */
function handleNavbarLogo(e) {
  e.stopPropagation();
  e.preventDefault();

  window.scrollTo(0, 0);

  document.querySelector(".active-link")?.classList.remove("active-link");
}

// main classes
// This Navbar class for render navbarTabs and provide some function for it
class Navbar {
  static navbarList = document.querySelector("#navbar__list");

  static activeTabLink = null;

  /**
   * @description - This is function used for addEventListner which is click on navbar tab link element
   *                and by passing to it as many as function you want pass to be executed
   *                when user click event trigger
   *
   * @param  {function} cbFunctions - This is param take callback functions
   */
  handleTabLinksOnclick(...cbFunctions) {
    for (let ele of Navbar.navbarList.children) {
      let tabLink = ele.firstElementChild;

      tabLink.addEventListener("click", (e) => {
        e.stopPropagation();
        e.preventDefault();

        cbFunctions.forEach((cb) => (typeof cb === "function" ? cb(e) : ""));
      });
    }
  }

  /**
   * @description - This is function used for render navbarTab element
   *
   * @param {string} sectionId - This is param for take section id value for using it to link navbarTabLink to this section
   * @param {string} text - This is param for take text that will represent as title of navbarTab
   * @param {string} activeClass - This is param for take active class value if there is to add it to navbarTabLink
   */
  renderNavbarTab(sectionId, text, activeClass = null) {
    const NAVBAR_TAB_LINK = document.createElement("a");

    NAVBAR_TAB_LINK.setAttribute("href", `#${sectionId}`);

    NAVBAR_TAB_LINK.setAttribute("alt", "navbar tab");

    NAVBAR_TAB_LINK.setAttribute(
      "class",
      `menu__link ${activeClass != null ? activeClass : ""}`
    );

    NAVBAR_TAB_LINK.textContent = `${text}`;

    NAVBAR_TAB_LINK.addEventListener("click", Navbar.handleNavbarTabLink);

    const LI = document.createElement("li");

    LI.appendChild(NAVBAR_TAB_LINK);

    return LI;
  }
}

// This scrollToTopBtn class for  render scrollToTop button and provide some function for it
class ScrollToTopBtn {
  static scrollToTopBtn = null;

  /**
   * @description - This is function used for scroll to the top of page
   *
   * @param {object} e - This is param for take event obj value
   */
  scrollToTop(e) {
    e.stopPropagation();

    document.documentElement.style.scrollBehavior = "smooth";

    setTimeout((e) => window.scrollTo(0, 0), 0);

    setTimeout(
      (e) => (document.documentElement.style.scrollBehavior = "initial"),
      0
    );
  }

  /**
   * @description - This is function used for handle scrollToTopBtn visibility onscroll
   *                by toggle show class on scrollToTop button ele
   *
   * @param {object} e - This is param for take event obj value
   */
  handleScrollToTopBtnVisibilityOnScroll = (e) => {
    e.stopPropagation();

    const scrollLimit = 40;

    toggleClassInScrollLimit(
      ScrollToTopBtn.scrollToTopBtn,
      "show",
      scrollLimit
    );
  };

  /**
   * @description - This is function used for render scrollToTopBtn element in page
   *
   * @param {string} icon - This is param for take icon element to add it as child to scrollToTopBtn
   */
  renderscrollToTopBtn(icon) {
    const SCROLL_TO_TOP_BTN = document.createElement("a");

    SCROLL_TO_TOP_BTN.innerHTML += icon ? icon : "";

    SCROLL_TO_TOP_BTN.setAttribute("class", "page__scroll-to-top-btn");

    ScrollToTopBtn.scrollToTopBtn = SCROLL_TO_TOP_BTN;

    return SCROLL_TO_TOP_BTN;
  }
}

// main function
let main = () => {
  // start coding for NavbarTabs
  const sections = document.querySelectorAll("body main section");

  const virtualDomEle = document.createDocumentFragment();

  const navbar = new Navbar();

  //   here i am trying to add navbarTab for every section to the navbar as child
  sections.forEach((ele, i) => {
    virtualDomEle.appendChild(navbar.renderNavbarTab(ele.id, ele.dataset.nav));
  });

  Navbar.navbarList.appendChild(virtualDomEle);

  navbar.handleTabLinksOnclick(toggleActiveClassOnTabs);

  // I'm reevalute pageHeaderHeight variable becuse the PAGE_HEADER height change after adding tabs in it
  pageHeaderHeight = PAGE_HEADER.getBoundingClientRect().height;

  // in this is line i am voke function for watching sections when user scrolling
  window.addEventListener("scroll", watchSectionsOnScroll);

  // start coding for NAVBAR_LOGO
  const NAVBAR_LOGO = document.querySelector(".navbar__logo");

  NAVBAR_LOGO.addEventListener("click", handleNavbarLogo);

  // start coding for handle pageHeaderHeight
  window.addEventListener("scroll", handlePageHeaderVisibility);

  PAGE_HEADER.addEventListener("mouseover", keepPageHeaderVisibleOnmouseover);

  // this line for revoke handlePageHeaderVisibility function when user move away from it
  PAGE_HEADER.addEventListener("mouseout", handlePageHeaderVisibility);

  window.addEventListener("mousemove", showPageHeader);

  // start coding for NAVBAR_DROPDWON_TOGGLER_BTN
  const NAVBAR_DROPDWON_TOGGLER_BTN = document.querySelector(
    ".navbar__dropdown-toggler"
  );

  NAVBAR_DROPDWON_TOGGLER_BTN.addEventListener("mousedown", addActiveClass);

  NAVBAR_DROPDWON_TOGGLER_BTN.addEventListener("mouseup", removeActiveClass);

  NAVBAR_DROPDWON_TOGGLER_BTN.addEventListener(
    "click",
    toggleExpandClassOnNavbarDropdown
  );

  // start coding for SCROLL_TO_TOP_BTN
  const SCROLL_TO_TOP_BTN_OBJ = new ScrollToTopBtn();

  const SCROLL_TO_TOP_BTN = SCROLL_TO_TOP_BTN_OBJ.renderscrollToTopBtn(
    `<i class="fa-solid fa-arrow-up"></i>`
  );

  document.body.appendChild(SCROLL_TO_TOP_BTN);

  SCROLL_TO_TOP_BTN.addEventListener(
    "click",
    SCROLL_TO_TOP_BTN_OBJ.scrollToTop
  );

  window.addEventListener(
    "scroll",
    SCROLL_TO_TOP_BTN_OBJ.handleScrollToTopBtnVisibilityOnScroll
  );
};
main();
