let table = document.getElementById("table");

//function to sort fetched response
const sortData = (data) => {
  let sortedData = [];
  data.forEach((item) => {
    sortedData[item.sequenceNO] = item;
  });

  return sortedData;
};

// onPress of row
const onPress = (object) => {
  let content = object.nextElementSibling;
  if (content.style.display === "block") {
    content.style.display = "none";
  } else {
    content.style.display = "block";
  }
};

//function to generate content of each row
const appendCollapsed = async (data) => {
  let response 
  try {
      response = await fetch(
    `http://localhost:3000/api/book/maths/section/${data.id}`
  );
  response = await response.json();
  }

  catch(error){ console.log(error);}
 
  let sortedResponse =
    response.response[data.id] && sortData(response.response[data.id]);

  let content =
    sortedResponse
      ?.map((item) => {
        let COMPLETE = "#4CAF50";
        let IN_PROGRESS = "#ffaa00";
        let NOT_STARTED = "grey";

        let status = eval(`${item.status}`);
        return `<h4 style = "color: ${status}">${data.sequenceNO}.${item.sequenceNO} ${item.title}</h4>`;
      })
      .join("") ||
    `<h4 style = "color: grey">${response.response.message}</h4>`;

  return `<div>${content}</div>`;
};

//function to generate a row.
const fetchContentOfTable = async (data) => {
  let content = await appendCollapsed(data);

  let status = ((data.completeCount / data.childrenCount) * 100).toFixed();

  status = isNaN(status) ? "" : "(" + status+ "% completed)";

  return `<button type="button" onClick= onPress(this)>
     ${data.sequenceNO}. ${data.title}  ${status}
    </button> ${content}`;
};

//function to generate all the rows
const generateTable = (elementToPopulate) => {
  let promise = [];

  fetch("http://localhost:3000/api/book/maths")
    .then((response) => response.json())
    .then(({ response }) => {
      let sortedResponse = sortData(response);
      sortedResponse.forEach((row) => {
        promise.push(fetchContentOfTable(row));
      });

      Promise.all(promise).then((result) => {
        return (elementToPopulate.innerHTML = result.join(""));
      });
    })
    .catch((data) => console.log(data));
};

//call method to generate table
generateTable(table);
