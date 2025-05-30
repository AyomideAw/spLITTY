module GroupSplitter::splitty_v2 {

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

    public entry fun create_group(account: &signer, members: vector<address>) {
        let addr = signer::address_of(account);

        if (!exists<Group>(addr)) {
            let balances = table::new<address, u64>();
            let i = 0;

            while (i < vector::length(&members)) {
                let member = *vector::borrow(&members, i);


                if (!table::contains(&balances, member)) {
                    table::add(&mut balances, member, 0);
                };

                i = i + 1;
            };

            move_to(account, Group {
                members,
                expenses: vector::empty<Expense>(),
                balances,
            });
        };
    }

    public entry fun log_expense(account: &signer, description: string::String, amount: u64) acquires Group {
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

    public entry fun settle(account: &signer, to: address, amount: u64) acquires Group {
        let group = borrow_global_mut<Group>(signer::address_of(account));
        let sender = signer::address_of(account);

        // Ensure sender exists in the balances table
        if (!table::contains(&group.balances, sender)) {
            table::add(&mut group.balances, sender, 0);
        };

        // Ensure receiver exists in the balances table
        if (!table::contains(&group.balances, to)) {
            table::add(&mut group.balances, to, 0);
        };

        // Now safe to remove
        let sender_bal = table::remove(&mut group.balances, sender);
        let receiver_bal = table::remove(&mut group.balances, to);

        // Check sender has enough
        assert!(sender_bal >= amount, 100);

        // Add updated values back
        table::add(&mut group.balances, sender, sender_bal - amount);
        table::add(&mut group.balances, to, receiver_bal + amount);
    }



}
