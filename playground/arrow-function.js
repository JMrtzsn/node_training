const event = {
    name: "test",
    guestList: ["andew", "johan", "boys"],
    printGuestlist() {
        console.log(this.name + " is the guest test")
        this.guestList.forEach( (guest) => console.log(guest, this.name))
    }
}
// Arrow functions are great for internal functions, but bad for obect methods as they
//dont have a this (object) reference

event.printGuestlist()