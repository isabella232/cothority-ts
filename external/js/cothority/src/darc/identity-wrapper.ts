import { Message } from "protobufjs/light";
import { registerMessage } from "../protobuf";
import IdentityDarc from "./identity-darc";
import IdentityEd25519 from "./identity-ed25519";

/**
 * Protobuf representation of an identity
 */
export default class IdentityWrapper extends Message<IdentityWrapper> {
    /**
     * @see README#Message classes
     */
    static register() {
        registerMessage("Identity", IdentityWrapper, IdentityEd25519, IdentityDarc);
    }

    /**
     * fromIdentity returns an IdentityWrapper for a given Identity
     */
    static fromIdentity(id: IIdentity): IdentityWrapper {
        if (id.toString().startsWith("ed25519:")) {
            return new IdentityWrapper({ed25519: id as IdentityEd25519});
        }
        if (id.toString().startsWith("darc:")) {
            return new IdentityWrapper({darc: id as IdentityDarc});
        }
    }

    /**
     * fromEd25519 returns an IdentityWrapper for a given IdentityDarc
     */
    static fromEd25519(id: IdentityEd25519): IdentityWrapper {
        return new IdentityWrapper({ed25519: id});
    }

    readonly ed25519: IdentityEd25519;
    readonly darc: IdentityDarc;

    /**
     * Get the inner identity as bytes
     * @returns the bytes
     */
    toBytes(): Buffer {
        if (this.ed25519) {
            return this.ed25519.public.marshalBinary();
        }
        if (this.darc) {
            return this.darc.toBytes();
        }

        return Buffer.from([]);
    }

    /**
     * Get the string representation of the identity
     * @returns a string of the identity
     */
    toString(): string {
        if (this.ed25519) {
            return this.ed25519.toString();
        }
        if (this.darc) {
            return this.darc.toString();
        }

        return "empty signer";
    }
}

/**
 * Identity is an abstract class for all the Darcs's identities
 */
export interface IIdentity {
    /**
     * Returns true if the verification of signature on the sha-256 of msg is
     * successful or false if not.
     * @param msg       the message to verify
     * @param signature the signature to verify
     * @returns true when the signature matches the message, false otherwise
     */
    verify(msg: Buffer, signature: Buffer): boolean;

    /**
     * Get the byte array representation of the public key of the identity
     * @returns the public key as buffer
     */
    toBytes(): Buffer;

    /**
     * Get the string representation of the identity
     * @return a string representation
     */
    toString(): string;
}

IdentityWrapper.register();
