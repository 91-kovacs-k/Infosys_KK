export class Queue<T> {
    private queue: T[];
    private length: number; // a sorban lévő elemek száma
    private readonly maxSize: number; // sorban állók maximum száma

    public constructor(maxSize: number) {
        // a sor nagyobb legyen mint 0:
        this.maxSize = maxSize > 0 ? maxSize : 10;
        this.length = 0;
        this.queue = new Array<T>(this.maxSize);
    }

    public isEmpty(): boolean {
        return this.length === 0;
    }

    public isFull(): boolean {
        return this.length === this.maxSize;
    }

    public enqueue(newItem: T): void {
        if (this.isFull()) {
            throw new Error('Sor túlcsordulás!');
        } else {
            this.queue[this.length++] = newItem; // miután beraktuk az új elemet, növelünk a sor hosszán
        }
    }

    public dequeue(): T {
        if (this.isEmpty()) {
            throw new Error('A sor üres!');
        }

        const retval = this.queue[0];

        for (let i = 0; i < this.length; i++) {
            this.queue[i] = this.queue[i + 1];  //elemek előrébb mozgatása
        }

        this.length--; // hossz csökkentése
        return retval;
    }

    public peek(): T {
        if (this.isEmpty()) {
            throw new Error('A sor üres!');
        }
        return this.queue[0];
    }

    public getLength() {
        return this.length;
    }

    public queueContents(): void {
        console.log('A sor elemei:');
        for (let i = 0; i < this.length; ++i) {
            console.log(`sor[${i}]: ${this.queue[i]}`);
        }
    }
}