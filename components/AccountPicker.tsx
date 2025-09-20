import React from 'react';
import { User } from '../types';

interface AccountPickerProps {
    users: User[];
    onSelect: (user: User) => void;
    onCancel: () => void;
}

const AccountPicker: React.FC<AccountPickerProps> = ({ users, onSelect, onCancel }) => {
    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="w-full max-w-sm bg-white/90 dark:bg-gray-800/90 backdrop-blur-lg rounded-2xl shadow-2xl border border-white/20 dark:border-gray-700/50">
                <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                    <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100">Choose an account</h2>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">to continue to CalmSpace</p>
                </div>
                <ul className="p-2">
                    {users.map(user => (
                        <li key={user.id}>
                            <button
                                onClick={() => onSelect(user)}
                                className="w-full flex items-center gap-4 p-3 rounded-lg hover:bg-gray-200/50 dark:hover:bg-gray-700/50 transition-colors duration-200 text-left"
                            >
                                <img src={user.photoURL} alt={user.displayName} className="w-10 h-10 rounded-full" />
                                <div>
                                    <p className="font-semibold text-gray-800 dark:text-gray-200">{user.displayName}</p>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">{user.email}</p>
                                </div>
                            </button>
                        </li>
                    ))}
                </ul>
                <div className="p-4 border-t border-gray-200 dark:border-gray-700 flex justify-end">
                    <button onClick={onCancel} className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200/50 dark:hover:bg-gray-700/50 transition-colors">
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AccountPicker;