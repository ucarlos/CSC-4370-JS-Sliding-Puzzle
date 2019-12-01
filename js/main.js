/* -----------------------------------------------------------------------------
 * Created by Ulysses Carlos on 11/24/2019
 * -----------------------------------------------------------------------------
 */ 

////////////////////////////////////////////////////////////////////////////////
// Global Variables
////////////////////////////////////////////////////////////////////////////////
const image_folder_list = ["./images/image01",  "./images/image02", "./images/image03",
                            "./images/image04", "./images/image05", "./images/image06",
                            "./images/image07", "./images/image08", "./images/image09",
                            "./images/image10", "./images/image11"               ];

var image_index = -1;
var td_list = undefined;
var empty_string = "EMPTY";
var current_image = empty_string;
var correct_image_list = [];
var current_image_list = [];
var table;
var puzzle_history = [];

/*
var player_history = [];
*/
var blank_image = "./images/blank.jpg";
var blank_index;
var max_images = 16;
const difficulty_level = ["babby", "easy", "normal", "hard", "insane", "god"];
const difficulty_values = [5, 15, 35, 65, 150, 300];

var difficulty = 25;


const row_len = max_images / 4;
const column_len = row_len;


var table_id = "image_table";

////////////////////////////////////////////////////////////////////////////////
// Randomize Functions
////////////////////////////////////////////////////////////////////////////////

function rand_int(min, max) {
    return Math.floor(Math.random() * (max - min ) ) + min;
}



////////////////////////////////////////////////////////////////////////////////
// Difficulty
////////////////////////////////////////////////////////////////////////////////
function change_difficulty(lower){
    var index = -1;
    for (var i = 0; i < difficulty_level.length; i++){
        if (lower == difficulty_level[i]){
            difficulty = difficulty_values[i];
            index = i;
        }
    }

    if (index != -1) return;
    else{
        window.alert("Reverting to Normal Difficulty...");
        difficulty = difficulty_values[2]; // Setting to normal
    }
}

function enter_difficulty(){
    var input = window.prompt("Please enter a difficulty level (Babby, Easy, Medium, Hard, Insane and God) .");
    if (input == null){
        window.alert("Invalid Input. Reverting to Normal Difficulty...");
        change_difficulty("normal");
    }

    var check = input.toLowerCase();
    change_difficulty(check);
}


////////////////////////////////////////////////////////////////////////////////
// Title Implementation
////////////////////////////////////////////////////////////////////////////////

function set_blank(index){
    current_image_list[index] = blank_image;
    td_list[index].setAttribute("src", blank_image);
    blank_index = index;
    correct_image_list = current_image_list.slice();
}

function move_to_blank(index1, index2){
    var check = is_in_bounds(index1) && is_in_bounds(index2);
    if (!check){
        console.log("Error: " + index1 + " or " + index2 + " is out of bounds.");
        return;
    }

    var temp = current_image_list[index1];
    current_image_list[index1] = blank_image;
    current_image_list[index2] = temp;

    // Now display it;
    td_list[index1].setAttribute("src", blank_image);
    td_list[index2].setAttribute("src", temp);

    // Now change blank_index:
    blank_index = index1;
    
}

function check_blank(index){
    return current_image_list[index] == blank_image;
}

function check_same_row(index1, index2){
    return (Math.floor(index1 / row_len) == (Math.floor(index2 / row_len)));
}
function move_up_check(index){
    var check = index - row_len;
    if (!is_in_bounds(check)) return false;
    else
        return check_blank(index - row_len);
}

function move_down_check(index){
    var check = index + row_len;
    if (!is_in_bounds(check)) return false;
    else
        return check_blank(index + row_len);
}

function move_right_check(index){
    var check = index + 1;
    if (!(is_in_bounds(check) && check_same_row(index, check))) return false;
    else
        return check_blank(check);
}

function move_left_check(index){
    var check = index - 1;
    if (!(is_in_bounds(check) && check_same_row(index, check))) return false;
    else
        return check_blank(check);
}


function move_wrapper(index){
    return function(){
        move(index);
    }
}

function check_neighbors(index){
    // There can only be one value;
    
    if (move_up_check(index))
        return index - row_len;
    else if (move_down_check(index))
        return index + row_len;
    else if (move_left_check(index))
        return index - 1;
    else if (move_right_check(index))
        return index + 1;
    else return -1; // Not possible.


}

function move(index){
//    console.log("Checking if image[" + index + "] can move ...\n");
    var value = check_neighbors(index);
    if (value != -1){
        //player_history.push(index);
        puzzle_history.push(index);
        move_to_blank(index, value);
        check_winning_condition();
    }
    else
        console.log("Can't move image[" + index + "] anywhere...");
    
}

function check_winning_condition(){
    var check;
    for (var i = 0; i < correct_image_list.length; i++)
        if (current_image_list[i] != correct_image_list[i]) return false;
    
    // if true // , now display an alert button to clear screen:
    
    window.alert("Congratulations, you have won the game.");
    location.reload();

}

function is_in_bounds(index){
    return ((0 <= index && index < max_images));
}


////////////////////////////////////////////////////////////////////////////////
// Randomize
////////////////////////////////////////////////////////////////////////////////

function move_blank(cardinal){
    var check;
    var temp;
    switch (cardinal){
        case 0: // Up
            temp = blank_index + row_len;
            check = move_up_check(temp);
            break;
        case 1: // Down
            temp = blank_index - row_len;
            check = move_down_check(temp);
            break;
        case 2: // Left:
            temp = blank_index  + 1;
            check = move_left_check(temp);
            break;
        case 3: // Right
            temp = blank_index - 1;
            check = move_right_check(temp);
            break;
        default:
            check = false; // Just do that.
    }

    if (check && is_in_bounds(temp)){
        puzzle_history.push(temp);
        move_to_blank(temp, blank_index);
    }

}

function shuffle_image(){
    
    var moves = difficulty;
    var rand;
    var directions = 4;
    var moved_blank = blank_index;
    for (var i = 0; i < moves; i++){
        rand = rand_int(0, directions);
        move_blank(rand);
        moved_blank = blank_index;
    }
    //player_history.push(puzzle_history[puzzle_history.length - 1 ]);
}

function nothing(){
    console.log("I do nothing.");
}

function swap(index1, index2){
    td_list = document.getElementsByTagName("img");
    var temp = current_image_list[index1];
    var temp2 = current_image_list[index2];
    current_image_list[index1] = temp2;
    current_image_list[index2] = temp;

    td_list[index1].setAttribute("src", temp2);
    td_list[index2].setAttribute("src", temp);
}



function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }


async function solve(){

    // First check if player history is empty//
    /*
    if (player_history.length != 0){
        for (var i = player_history.length - 1; i >= 1; i--)
        swap(player_history[i], player_history[i - 1]);
        await sleep(300);
    }
*/
    for (var i = puzzle_history.length - 1; i >= 1; i--){
        swap(puzzle_history[i], puzzle_history[i - 1]);
        await sleep(300);
    }

    await sleep (1000);
    window.alert("Problem solved. Reloading in 3 seconds.");
    await sleep (3000);
    location.reload();
}

function solve_for_me(){
    // Using the history list:
    
    if (puzzle_history <= 0){
        window.alert("I haven't randomized the puzzle yet. Chill.")
        return;
    }
    
    solve();
}


function print_history(){
    for (var i = puzzle_history.length - 1; i >= 1; i--)
        console.log(puzzle_history[i] + " -> " + puzzle_history[i - 1]);
}

function set_on_click_status(string){
    if (!(string == "read-only" || string == "clickable")){
        console.log("Error: Unknown string " + string + 
        " passed to function set_on_click_status\n");
        return;
    }

    td_list = document.getElementsByTagName("img");
    for (var i = 0; i < td_list.length; i++){
        if (string == "read-only")
            td_list.setAttribute("onclick", null);
        else
            td_list.setAttribute("onlick", move_wrapper(num));
    }
}
////////////////////////////////////////////////////////////////////////////////
// Main
////////////////////////////////////////////////////////////////////////////////

function initialize_current_image(){
    current_image_list = [];
    
    image_index = rand_int(0, image_folder_list.length);
    current_image = image_folder_list[image_index];
    // Now populate 
    draw_table();
    td_list = document.getElementsByTagName("img");
    // Set the last one to be the blank:
    //blank_index = td_list.length - 1;
    blank_index = rand_int(0, max_images);
    set_blank(blank_index);

    correct_image_list = current_image_list.slice();

    // Initialize History
    puzzle_history = [];
    puzzle_history.push(blank_index);

    
    setTimeout(shuffle_image, 1000 * 3);
    // Print History


    setTimeout(print_history, 1000 * 4);
    //player_history = [];
    /*
    setTimeout(function(){
        player_history.push(puzzle_history[puzzle_history.length -1]);
    }, 2000);
    */
 
}
change_difficulty("normal");


////////////////////////////////////////////////////////////////////////////////
// Draw Functions
////////////////////////////////////////////////////////////////////////////////
function draw_table(){
    table = document.getElementById("image_table");
    table.innerHTML = "";   
    var row;
    var table_d;
    var temp_image;
    var image_name;
    var num;

    for (var i = 0; i < row_len; i++){
        row = document.createElement("tr");
        for (var j = 0; j < column_len; j++){
            temp_image = document.createElement("img");
            num = column_len * i + j;
            image_name = current_image + "/image-" + j + "-" + i + ".jpg";
            temp_image.setAttribute("src", image_name);
            current_image_list.push(image_name);    
            table_d = document.createElement("td");
            table_d.appendChild(temp_image);
            row.appendChild(table_d);
            // temp_image.onclick = handle(num);
            temp_image.onclick = move_wrapper(num);
        }
        table.insertBefore(row, table.childNodes[i + 1]);
    }
    
}
