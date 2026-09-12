console.log("Hello");
const addNums=function(a,b){
    return a+b;
}
console.log(addNums(5,3));
const addNumbers=(a,b)=>{
    return a+b;
}
console.log(addNumbers(5,3));
const userProfile = { 
id: "EMP001", 
name: "Priya Sharma", 
email: "priya@company.com", 
role: "Frontend Developer" 
}; 
// --- THE OLD WAY --- 
let nameOld = userProfile.name; 
let emailOld = userProfile.email; 
// --- THE ES6 DESTRUCTURING WAY --- 
// The variable names MUST match the property keys in the object 
const { name, email } = userProfile; 
console.log(name);  // Output: Priya Sharma 
console.log(email); // Output: priya@company.com
const rgbColor = [255, 128, 0]; 
// --- THE OLD WAY --- 
let red = rgbColor[0]; 
let green = rgbColor[1]; 
let blue = rgbColor[2]; 
// --- THE ES6 DESTRUCTURING WAY --- 
// Variable names can be anything you choose, ordered left-to-right 
const [r,g,b] = rgbColor; 
console.log(r); // Output: 255 
console.log(g); // Output: 128 
console.log(b); // Output: 0
const frontendSkills = ["HTML", "CSS", "JavaScript"]; 
const fullStackSkills = [...frontendSkills, "React.js", "Node.js"]; 
console.log(fullStackSkills);  