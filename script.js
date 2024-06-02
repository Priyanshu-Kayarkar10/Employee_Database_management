(async () => {
  const data = await fetch("data.json");
  const res = await data.json();

  // Edit Employee
  const editBtn = document.querySelector(".edit");
  const editEmployee = document.querySelector(".editEmployee");
  const editEmployeeForm = document.querySelector(".editEmployee_form");
  let employees = JSON.parse(localStorage.getItem("employees")) || res;
  let selectedEmployee = employees[0];
  // selected emplopyee data
  let selectedEmployeeId = employees[0].id;

  // button segment
  const createEmployee = document.querySelector(".createEmployee");
  const addEmployeeModal = document.querySelector(".addEmployee");
  const addEmployeeForm = document.querySelector(".addEmployee_create");

  const employeeList = document.querySelector(".employee__names--list");
  //   const employeeItem = document.querySelector(".employes__name--item")
  const employeeInfo = document.querySelector(".employee__single--info");
  const saveToLocalStorage = () => {
    localStorage.setItem("employees", JSON.stringify(employees));
  };

  // selected employee Id
  // Printing the previous values LOGIC:
  editBtn.addEventListener("click", (e) => {
    editEmployee.style.display = "flex";

    const {
      firstName,
      lastName,
      dob,
      Salary,
      age,
      address,
      contactNumber,
      email,
      imageUrl,
    } = selectedEmployee;

    [...editEmployeeForm].map((data, index) => {
      if (data.name === "firstName") {
        data.value = firstName;
      } else if (data.name === "lastName") {
        data.value = lastName;
      } else if (data.name === "imageUrl") {
        data.value = imageUrl;
      } else if (data.name === "Salary") {
        data.value = String(Salary);
      } else if (data.name === "email") {
        data.value = email;
      } else if (data.name === "address") {
        data.value = address;
      } else if (data.name === "dob") {
        data.value = dob;
      } else if (data.name === "contactNumber") {
        data.value = String(contactNumber);
      }
    });
  });

  editEmployeeForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const formData = new FormData(editEmployeeForm);
    const values = [...formData.entries()];
    let empData = {};
    values.forEach((val) => {
      empData[val[0]] = val[1];
    });

    empData.imageUrl = empData.imageUrl || "https://svgur.com/i/16hm.svg";

    const dobInput = document.querySelector(".editEmployee--dob");
    dobInput.max = `${new Date().getFullYear() - 18} -${new Date()
      .toISOString()
      .slice(5, 10)}`;

    empData.age =
      new Date().getFullYear() - parseInt(empData.dob.slice(0, 4), 10);
    employees.forEach((emp) => {
      if (emp.id === Number(selectedEmployeeId)) {
        if (employees[selectedEmployeeId]) {
          let employee = employees[selectedEmployeeId];
          employee.address = empData.address;
          employee.email = empData.email;
          employee.firstName = empData.firstName;
          employee.lastName = empData.lastName;
          employee.Salary = empData.Salary;
          employee.contactNumber = empData.contactNumber;
          employee.dob = empData.dob;
          employee.age = empData.age;
          employee.imageUrl = empData.imageUrl;
          saveToLocalStorage();
        }
      }
    });
    renderImployees();
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
    const values = [...formData.entries()];
    let empData = {};
    values.forEach((val) => {
      empData[val[0]] = val[1];
    });

    // empData.id
    if (employees[employees.length - 1] == undefined) {
      empData.id = Number(employees.length);
    } else {
      empData.id = Number(employees[employees.length - 1].id + 1);
    }

    empData.imageUrl = empData.imageUrl || "https://svgur.com/i/16hm.svg";

    const dobInput = document.querySelector(".addEmployee_create--dob");
    dobInput.max = `${new Date().getFullYear() - 18} -${new Date()
      .toISOString()
      .slice(5, 10)}`;

    empData.age =
      new Date().getFullYear() - parseInt(empData.dob.slice(0, 4), 10);

    employees.push(empData);
    saveToLocalStorage();
    renderImployees();
    addEmployeeForm.reset();
    addEmployeeModal.style.display = "none";
  });

  // Select Employee LOGIC and deleting employee

  employeeList.addEventListener("click", (e) => {
    if (e.target.tagName === "SPAN" && selectedEmployeeId != e.target.id) {
      selectedEmployeeId = e.target.id;
      renderImployees();
      // render Single Employee
    }
    if (e.target.tagName === "I") {
      employees = employees.filter(
        (emp) => String(emp.id) !== e.target.parentNode.id
      );
      saveToLocalStorage();
    }
    if (String(selectedEmployeeId) === e.target.parentNode.id) {
      selectedEmployeeId = employees[0]?.id || -1;
      selectedEmployee = employees[0] || "";
      renderSingleEmplyee();
    }

    renderImployees();
  });

  const renderImployees = () => {
    employeeList.innerHTML = "";
    employees.forEach((emp) => {
      const employee = document.createElement("span");
      employee.classList.add("employes__name--item");

      if (selectedEmployeeId == emp.id) {
        employee.classList.add("selected");
        selectedEmployee = emp;
      }

      employee.setAttribute("id", emp.id);
      employee.innerHTML = `${emp.firstName} ${emp.lastName} <i class="employeeDelete" >❌</i> `;

      employeeList.append(employee);
      renderSingleEmplyee();
    });
  };

  const renderSingleEmplyee = (e) => {
    // deleting employee;
    if (selectedEmployeeId === -1) {
      employeeInfo.innerHTML = "";
      return;
    }
    employeeInfo.innerHTML = `
    <img class="profileImage" src="${selectedEmployee.imageUrl}" />
    <span class="employee__single--heading" >
    
    ${selectedEmployee.firstName} ${selectedEmployee.lastName} ( ${selectedEmployee.age} )
    <span>${selectedEmployee.address}</span>
    <span class="email" >${selectedEmployee.email}</span>
    <span>Mobile - ${selectedEmployee.contactNumber}</span>
    <span>DOB - ${selectedEmployee.dob}</span>
    </span>
    `;
  };

  if (selectedEmployee) renderSingleEmplyee();
  renderImployees();
})();
