/**
 * This is the entry point to the program
 * Question 1 - Classifier
 *
 * @param {any} input Array of student objects
 */

// Data definitions
/*
==> Student            -> {name : String, dob: String, regNo: String}
==> (listof Student) is one of:
    - []
    - (listof Student).push(Student)
==> GroupMemeber       -> {name: String, age: Number, dob: Timestamp, regNo: String}
==> Group              -> {members: (listof GroupMember), oldest: Number, sum: Number,
                           regNos: (listof Numbers)<->ASC}
==> Groups             -> Group1, Group2, ......, GroupN where N is the number of Groups
==> ClassifiedStudents -> Object.assign({}, {noOfGroups: Number}, {Groups})
*/

// Steps
/*
===> sortByAge()          -> sort Student by age
===> calculateAge()       -> given a UTC format Timestamp, calculates the age of Student
===> validAgeDifference() -> ensures difference in years of the ages of Students in any particular group
                             is not more than 5.
===> groupStudents()      -> groups students in sets with maximum of 3 in a set
===> sumAges()            -> sum the ages of group members
===> classify()           -> produces ClassifiedStudents with properties - noOfGroups, Groups.
*/

// (listof Student) -> (listof Student)
// sort Student by age
const sortByAge = (allStudents) => {

  const newStudents = JSON.parse(JSON.stringify(allStudents));

    for (let student of newStudents) {
      let studentAge = calculateAge(student.dob);
      student.age = studentAge;
    }

    return newStudents.sort((a,b) => a.age - b.age)

}

// Timestamp -> Age
// given a UTC format Timestamp, calculates the age of Student
const calculateAge = (dob) => {
  const birthYear = new Date(dob).getFullYear();
  const currentYear = new Date().getFullYear();
  return currentYear - birthYear;
}

// (listof Students) -> (listof Students)
// ensures the difference in years of the ages of student in any particular group is not more than 5.
const validAgeDifference = (student, groups) => {
  return groups.every((stud) => {
    if (calculateAge(stud.dob) < calculateAge(student.dob)) {
        return calculateAge(student.dob) - calculateAge(stud.dob) <= 5;
    }

    return calculateAge(stud.dob) - calculateAge(student.dob) <= 5;

    });
}

// (listof Student) -> (listof Student)
// groups students in sets with maximum of 3 in a set
  const groupStudents = (sortedStudents) => {

    let grouped = [];
    grouped.push(sortedStudents.splice(0, 1));

    while (sortedStudents.length > 0) {
        let bool = false;
        const student = sortedStudents.splice(0, 1)[0];

        grouped.forEach((group) => {
            if (validAgeDifference(student, group) && group.length <= 2) {
                group.push(student);
                bool = true;
            }
        });

        if (!bool) {
          grouped.push([student]);
        }
    }
    return grouped;

  }

// (listof GroupAges) -> TotalAge
// sum the ages of group members
const sumAges = (groupAges) => {
  return groupAges.reduce((a,b) => {return a + b}, 0);
}

// (listof Student) -> ClassifiedStudents
/* produces an object of classified students with properties -
   [noOfGroups, groupNum<->(containing group info)]
*/
const classify = (groupedStudents) => {
  const students = {};

  for (let [index, group] of groupedStudents.entries()) {

    const groupNo = index + 1;
    const groupAges = group.map((member) => member.age);
    const sum = sumAges(groupAges);
    const oldest = Math.max(...groupAges);

    const groupObj = {
      members: group.map((member) => {
        return {
          name: member.name,
          age: member.age,
          dob: member.dob,
          regNo: member.regNo
        }
      }),
      oldest: oldest,
      sum: sum,
      regNos: group.map((member) => parseInt(member.regNo)).sort((a,b) => a - b)
    };

    if (!students.hasOwnProperty(`group${groupNo}`)) {
      students[`group${groupNo}`] = groupObj;
    }

  }

  return Object.assign({}, {noOfGroups: groupedStudents.length}, students);

}


// (listof Student) -> ClassifiedStudents
// classifies Students in groups and specifies the number of groups
const classifier = (students) => {
  if (students.length === 0) {
    return {noOfGroups: 0};
  }
  return classify(groupStudents(sortByAge(students)));
}

module.exports = classifier;
