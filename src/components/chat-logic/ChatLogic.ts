// export const getSender = (users: any) => {
//   return users[1]?.name || "Unknown";
// };

export const getSender = (loggedUser: any, users: any) => {
  return users[0]?._id === loggedUser?._id ? users[0].name : users[1].name;
};
export const getSenderImage = (loggedUser: any, users: any) => {
  return users[0]?._id === loggedUser?._id ? users[0].image : users[1].image;
};

export const getSenderFull = (loggedUser: any, users: any) => {
  return users[1]._id === loggedUser._id ? users[0] : users[1];
};
