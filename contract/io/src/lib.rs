#![no_std]

use gmeta::{InOut, Metadata, Out};
use gstd::prelude::*;

// Define a struct `HamsterMetadata` which will implement the `Metadata` trait.
pub struct HamsterMetadata;

// Implement the `Metadata` trait for the `HamsterMetadata` struct.
impl Metadata for HamsterMetadata {
    type Init = ();
    // The type used for handling messages. It uses `InOut` which means it accepts an input and produces an output.
    // Here, both input and output types are `String`.
    type Handle = InOut<String, String>;
    type Others = ();
    type Reply = ();
    type Signal = ();
    // This type represents the state of the contract. It uses `Out` to indicate the output type is `u128`.
    type State = Out<u128>;
}
