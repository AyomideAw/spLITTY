module GroupSplitter::GroupSplitter {
    use std::signer;
    use std::string;
    use std::vector;
    use std::table;

    struct Expense has copy, drop, store {
        description: string::String,
        amount: u64,
        paid_by: address,
    }

    struct Group has key {
        members: vector<address>,
        expenses: vector<Expense>,
        balances: table::Table<address, u64>,
    }

    public fun create_group(account: &signer, members: vector<address>) {
        let balances = table::new<address, u64>();
        let i = 0;
        while (i < vector::length(&members)) {
            let member = *vector::borrow(&members, i);
            table::add(&mut balances, member, 0);
            i = i + 1;
        };

        move_to(account, Group {
            members,
            expenses: vector::empty<Expense>(),
            balances,
        });
    }

    public fun log_expense(account: &signer, description: string::String, amount: u64) acquires Group {
        let group = borrow_global_mut<Group>(signer::address_of(account));
        let sender = signer::address_of(account);
        let expense = Expense {
            description,
            amount,
            paid_by: sender,
        };
        vector::push_back(&mut group.expenses, expense);

        // Add to sender's balance
        let old_balance = table::remove(&mut group.balances, sender);
        table::add(&mut group.balances, sender, old_balance + amount);
    }

    public fun get_balance(account: &signer, user: address): u64 acquires Group {
        let group = borrow_global<Group>(signer::address_of(account));
        *(table::borrow(&group.balances, user))
    }

    public fun settle(account: &signer, to: address, amount: u64) acquires Group {
        let group = borrow_global_mut<Group>(signer::address_of(account));
        let sender = signer::address_of(account);
        let sender_bal = table::remove(&mut group.balances, sender);
        let receiver_bal = table::remove(&mut group.balances, to);

        assert!(sender_bal >= amount, 100);
        table::add(&mut group.balances, sender, sender_bal - amount);
        table::add(&mut group.balances, to, receiver_bal + amount);
    }
}
