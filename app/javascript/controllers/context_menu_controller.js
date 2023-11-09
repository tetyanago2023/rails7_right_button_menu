import { Controller } from "@hotwired/stimulus";

// Connects to data-controller="context-menu"
export default class extends Controller {
  static targets = ["menu", "editLink", "deleteLink", "showLink"];

  // This is called when the controller is connected to the DOM
  // Here, we bind the hideMenu method to this instance and add event listeners
  connect() {
    this.hideMenu = this.hideMenu.bind(this);
    document.addEventListener("click", this.hideMenu);
    // document.addEventListener("scroll", this.hideMenu);
  }

  // This is called when the controller is disconnected from the DOM
  // Here, we remove the click event listener
  disconnect() {
    document.removeEventListener("click", this.hideMenu);
    document.removeEventListener("scroll", this.hideMenu);
  }

  // This method handles opening of the context menu
  // It prevents the default and propagation of the click event,
  // gets the todoId from the clicked element, updates link targets,
  // toggles visibility of menu options, positions the menu and shows it
  open(event) {
    event.preventDefault();
    event.stopPropagation();

    let clickedElement = event.target;
    let todoId = this.getTodoId(clickedElement);

    if (todoId) {
      this.prepareMenuForTodoItem(todoId);
    } else {
      this.hideMenuOptions();
    }

    this.positionMenu(event);
    this.menuTarget.classList.remove("hidden");
  }

  // Prepares the context menu for a todo item
  // It updates the href attributes of the link targets and shows the menu options
  prepareMenuForTodoItem(todoId) {
    this.updateLinkTargets(todoId);
    this.showMenuOptions();
  }

  // Hides the edit and delete menu options
  hideMenuOptions() {
    this.toggleMenuOptions(true);
  }

  // Shows the edit and delete menu options
  showMenuOptions() {
    this.toggleMenuOptions(false);
  }

  // Updates the href attributes of the link targets using the provided todoId
  updateLinkTargets(todoId) {
    // TODO: Maybe consider refactoring to use a stimulus value instead,
    // then feed the stimulus value the todos_path?
    const todoPath = `/todos/${todoId}`;
    this.showLinkTarget.href = todoPath;
    this.editLinkTarget.href = `${todoPath}/edit`;
    this.deleteLinkTarget.href = todoPath;
  }

  // Returns the todoId from the closest 'tr' element of the clickedElement
  getTodoId(clickedElement) {
    return clickedElement.closest("tr").dataset.todoId;
  }

  // Toggles the visibility of the edit and delete menu options based on the provided 'hide' flag
  toggleMenuOptions(hide) {
    this.showLinkTarget.classList.toggle("hidden", hide);
    this.editLinkTarget.classList.toggle("hidden", hide);
    this.deleteLinkTarget.classList.toggle("hidden", hide);
  }

  // Positions the menu based on the click event
  // It gets the dimensions of the menu, calculates the left and top positions
  // using the clampValue method, and sets these values as the left and top style properties of the menu
  positionMenu(event) {
    let menuDimensions = this.getDimensions(this.menuTarget);
    this.menuTarget.style.left = `${this.clampValue(
        event.clientX,
        window.innerWidth,
        menuDimensions.width
    )}px`;
    this.menuTarget.style.top = `${this.clampValue(
        event.clientY,
        window.innerHeight,
        menuDimensions.height
    )}px`;
  }

  // Returns a clamped value which is used to set an element's position so it fits within the viewport
  clampValue(value, maxValue, elementDimension) {
    let viewportDimension = maxValue - elementDimension;
    return value > viewportDimension ? viewportDimension : value;
  }

  // Returns the dimensions of the provided element
  // It makes the element visible, gets its dimensions and hides it again
  getDimensions(element) {
    let dimensions = {};
    element.classList.remove("hidden");
    dimensions.width = element.offsetWidth;
    dimensions.height = element.offsetHeight;
    element.classList.add("hidden");
    return dimensions;
  }

  // Hides the menu when a click event occurs outside the menu or on a link within the menu
  hideMenu(event) {
    if (this.shouldHideMenu(event)) {
      this.menuTarget.classList.add("hidden");
    }
  }

  // Determines whether the menu should be hidden based on the event target
  // It returns true if the event target is outside the menu,
  // or if it is the menu itself, or if it is a link within the menu
  shouldHideMenu(event) {
    return (
        !this.menuTarget.contains(event.target) ||
        event.target === this.menuTarget ||
        event.target.closest("a")
    );
  }
}

