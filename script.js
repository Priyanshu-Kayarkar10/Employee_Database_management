(async () => {
  const data = await fetch("data.json");
  const res = await data.json();

  const editBtn = document.querySelector(".edit");
  const editEmployee = document.querySelector(".editEmployee");
  const editEmployeeForm = document.querySelector(".editEmployee_form");
  const createEmployee = document.querySelector(".createEmployee");
  const addEmployeeModal = document.querySelector(".addEmployee");
  const addEmployeeForm = document.querySelector(".addEmployee_create");
  const employeeList = document.querySelector(".employee__names--list");
  const employeeInfo = document.querySelector(".employee__single--info");

  let employees = JSON.parse(localStorage.getItem("employees")) || res;
  let selectedEmployeeId = employees[0]?.id || -1;

  const saveToLocalStorage = () => {
    localStorage.setItem("employees", JSON.stringify(employees));
  };

  const renderEmployees = () => {
    employeeList.innerHTML = "";
    employees.forEach((emp) => {
      const employeeItem = document.createElement("span");
      employeeItem.classList.add("employes__name--item");
      if (emp.id === selectedEmployeeId) {
        employeeItem.classList.add("selected");
      }
      employeeItem.setAttribute("id", emp.id);
      employeeItem.innerHTML = `${emp.firstName} ${emp.lastName} <i class="employeeDelete">❌</i>`;
      employeeList.append(employeeItem);
    });
    renderSingleEmployee();
  };

  const renderSingleEmployee = () => {
    const selectedEmployee = employees.find(emp => emp.id === selectedEmployeeId);
    if (!selectedEmployee) {
      employeeInfo.innerHTML = "";
      return;
    }
    employeeInfo.innerHTML = `
      <img class="profileImage" src="${selectedEmployee.imageUrl}" />
      <span class="employee__single--heading">
        ${selectedEmployee.firstName} ${selectedEmployee.lastName} (${selectedEmployee.age})
        <span>${selectedEmployee.address}</span>
        <span class="email">${selectedEmployee.email}</span>
        <span>Mobile - ${selectedEmployee.contactNumber}</span>
        <span>DOB - ${selectedEmployee.dob}</span>
      </span>
    `;
  };

  const populateEditForm = () => {
    const selectedEmployee = employees.find(emp => emp.id === selectedEmployeeId);
    if (!selectedEmployee) return;
    const {
      firstName, lastName, dob, Salary, address, contactNumber, email, imageUrl
    } = selectedEmployee;
    editEmployeeForm.firstName.value = firstName;
    editEmployeeForm.lastName.value = lastName;
    editEmployeeForm.dob.value = dob;
    editEmployeeForm.Salary.value = Salary;
    editEmployeeForm.address.value = address;
    editEmployeeForm.contactNumber.value = contactNumber;
    editEmployeeForm.email.value = email;
    editEmployeeForm.imageUrl.value = imageUrl || "https://svgur.com/i/16hm.svg";
  };

  const updateEmployeeData = (formData) => {
    const empData = Object.fromEntries(formData.entries());
    empData.age = new Date().getFullYear() - parseInt(empData.dob.slice(0, 4), 10);
    empData.imageUrl = empData.imageUrl || "https://svgur.com/i/16hm.svg";
    employees = employees.map(emp => emp.id === selectedEmployeeId ? { ...emp, ...empData } : emp);
    saveToLocalStorage();
    renderEmployees();
  };

  const addNewEmployee = (formData) => {
    const empData = Object.fromEntries(formData.entries());
    empData.id = employees.length ? employees[employees.length - 1].id + 1 : 0;
    empData.age = new Date().getFullYear() - parseInt(empData.dob.slice(0, 4), 10);
    empData.imageUrl = empData.imageUrl || "https://svgur.com/i/16hm.svg";
    employees.push(empData);
    saveToLocalStorage();
    renderEmployees();
  };

  // Event Listeners
  editBtn.addEventListener("click", () => {
    editEmployee.style.display = "flex";
    populateEditForm();
  });

  editEmployeeForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const formData = new FormData(editEmployeeForm);
    updateEmployeeData(formData);
    editEmployeeForm.reset();
    editEmployee.style.display = "none";
  });

  editEmployee.addEventListener("click", (e) => {
    if (e.target.className === "editEmployee") {
      editEmployee.style.display = "none";
    }
  });

  createEmployee.addEventListener("click", () => {
    addEmployeeModal.style.display = "flex";
  });

  addEmployeeModal.addEventListener("click", (e) => {
    if (e.target.className === "addEmployee") {
      addEmployeeModal.style.display = "none";
    }
  });

  addEmployeeForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const formData = new FormData(addEmployeeForm);
    addNewEmployee(formData);
    addEmployeeForm.reset();
    addEmployeeModal.style.display = "none";
  });

  employeeList.addEventListener("click", (e) => {
    const targetId = e.target.parentNode.id;
    if (e.target.tagName === "SPAN" && selectedEmployeeId !== Number(targetId)) {
      selectedEmployeeId = Number(targetId);
      renderEmployees();
    }
    if (e.target.tagName === "I") {
      employees = employees.filter(emp => emp.id !== Number(targetId));
      saveToLocalStorage();
      if (selectedEmployeeId === Number(targetId)) {
        selectedEmployeeId = employees[0]?.id || -1;
      }
      renderEmployees();
    }
  });

  renderEmployees();
})();
