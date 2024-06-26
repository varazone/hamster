#![no_std]

use gstd::{msg, prelude::*};

// Define a static mutable variable `COUNTER` to store the click count. It is initially uninitialized.
static mut COUNTER: Option<u128> = None;

// The `init` function is called once when the contract is deployed. It initializes the `COUNTER` to 0.
#[no_mangle]
extern fn init() {
    unsafe {
        COUNTER = Some(0);
    }
}

// The `handle` function processes incoming messages. It expects a message of type `String`.
// If the message is "Click", it increments the `COUNTER` by 1 and replies with "Success".
#[no_mangle]
extern fn handle() {
    // Load the message.
    let new_msg: String = msg::load().expect("Unable to create string");

    // Check if the message is "Click".
    if new_msg == "Click" {
        // Safely access and modify the `COUNTER`.
        let counter = unsafe {
            COUNTER.as_mut().expect("Unexpected uninitialized `COUNTER`.")
        };
        *counter += 1; // Increment the counter.
        
        // Send a reply message with "Success".
        msg::reply_bytes("Success", 0).expect("Unable to reply");
    }
}

// The `state` function returns the current state of the `COUNTER`.
#[no_mangle]
extern fn state() {
    // Reply with the current value of `COUNTER`. Clone the value to ensure it is not modified by the `handle` function.
    msg::reply(unsafe { COUNTER.clone().expect("Unexpected uninitialized `COUNTER`.") }, 0)
        .expect("Failed to encode or reply with `<HamsterMetadata as Metadata>::State` from `state()`");
}

// Test module to verify the functionality of the contract.
#[cfg(test)]
mod tests {
    extern crate std;

    use gstd::{Encode, String};
    use gtest::{Log, Program, System};

    // A test case to validate the contract's behavior.
    #[test]
    fn it_works() {
        // Initialize a new system for testing.
        let system = System::new();
        system.init_logger();

        // Initialize the current program instance.
        let program = Program::current_opt(&system);

        // Send an "INIT" message to initialize the contract.
        let res = program.send_bytes(10, "INIT");
        assert!(!res.main_failed());

        // Read the initial state of the counter. It should be 0.
        let counter: u128 = program.read_state(0).expect("Unexpected invalid state.");
        assert_eq!(counter, 0);

        // Send a "Click" message to the contract.
        let res = program.send_bytes(10, String::from("Click").encode());
        // Verify that the reply message contains "Success".
        let log = Log::builder().source(1).dest(10).payload_bytes("Success");
        assert!(res.contains(&log));

        // Read the state of the counter again. It should be incremented to 1.
        let counter: u128 = program.read_state(0).expect("Unexpected invalid state.");
        assert_eq!(counter, 1);
    }
}
