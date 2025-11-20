// Member credentials for authentication
// In a production environment, these should be stored securely in a database with hashed passwords

export interface MemberCredential {
  username: string;
  password: string;
  displayName: string;
}

// Using let instead of const to allow modifications
export let memberCredentials: MemberCredential[] = [
  { username: 'bryan', password: 'bryan123', displayName: 'Bryan' },
  { username: 'deign', password: 'deign123', displayName: 'Deign' },
  { username: 'jv', password: 'jv123', displayName: 'Jv' },
  { username: 'lorraine', password: 'lorraine123', displayName: 'Lorraine' },
  { username: 'margaux', password: 'margaux123', displayName: 'Margaux' },
  { username: 'raineer', password: 'raineer123', displayName: 'Raineer' },
  { username: 'sean', password: 'sean123', displayName: 'Sean' },
  { username: 'mark', password: 'mark123', displayName: 'Mark' },
];

export const validateMemberCredentials = (username: string, password: string): string | null => {
  const member = memberCredentials.find(
    m => m.username.toLowerCase() === username.toLowerCase() && m.password === password
  );
  return member ? member.displayName : null;
};

export const isAdminCredentials = (username: string, password: string): boolean => {
  return username.toLowerCase() === 'mazy' && password === 'mazy123';
};

export const updateMemberCredentials = (
  oldDisplayName: string,
  newUsername?: string,
  newPassword?: string,
  newDisplayName?: string
): boolean => {
  const index = memberCredentials.findIndex(c => c.displayName === oldDisplayName);
  if (index !== -1) {
    memberCredentials[index] = {
      username: newUsername || memberCredentials[index].username,
      password: newPassword || memberCredentials[index].password,
      displayName: newDisplayName || memberCredentials[index].displayName,
    };
    return true;
  }
  return false;
};
