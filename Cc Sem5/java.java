1.2 2nd

import java.util.*;

class LibraryItem {
    protected int itemId;
    protected int titleCode;
    protected boolean available;

    public LibraryItem(int itemId, int titleCode, boolean available) {
        this.itemId = itemId;
        this.titleCode = titleCode;
        this.available = available;
    }
}

class Book extends LibraryItem {

    public Book(int itemId, int titleCode, boolean available) {
        super(itemId, titleCode, available);
    }

    public void displayDetails() {
        System.out.println("Book ID: " + itemId);
        System.out.println("Title Code: " + titleCode);
        System.out.println("Available: " + available);
    }

    public void checkOut() {
        if (available) {
            available = false;
            System.out.println("Book Checked Out Successfully.");
        } else {
            System.out.println("Already checked out.");
        }
    }

    public void returnBook() {
        if (!available) {
            available = true;
            System.out.println("Book Returned Successfully.");
        } else {
            System.out.println("Already available.");
        }
    }

    public void processOperation(int code) {
        switch (code) {
            case 1:
                checkOut();
                break;
            case 2:
                returnBook();
                break;
            case 3:
                displayDetails();
                break;
            default:
                System.out.println("Invalid operation.");
        }
    }
}

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);

        int itemId = sc.nextInt();
        int titleCode = sc.nextInt();
        int availInt = sc.nextInt();
        boolean available = availInt == 1;

        Book book = new Book(itemId, titleCode, available);

        while (sc.hasNextInt()) {
            int operation = sc.nextInt();
            book.processOperation(operation);
        }
    }
}