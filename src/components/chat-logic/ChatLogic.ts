// export const getSender = (users: any) => {
//   return users[1]?.name || "Unknown";
// };

export const getSender = (loggedUser: any, users: any) => {
  return users[0]?._id === loggedUser?._id ? users[1].name : users[0].name;
};

// export const getSender = (loggedUser: any, users: any) => {
//   return users[0]?._id === loggedUser?._id ? users[0].name : users[1].name;
// };
export const getSenderImage = (loggedUser: any, users: any) => {
  return users[0]?._id === loggedUser?._id ? users[1].image : users[0].image;
};

export const isSameSenderMargin = (
  messages: any,
  m: any,
  i: any,
  userId: any
) => {
  if (
    i < messages.length - 1 &&
    messages[i + 1].sender &&
    messages[i].sender &&
    messages[i + 1].sender._id === m.sender._id &&
    messages[i].sender._id !== userId
  ) {
    return 40;
  } else if (
    (i < messages.length - 1 &&
      messages[i + 1].sender &&
      messages[i].sender &&
      messages[i + 1].sender._id !== m.sender._id &&
      messages[i].sender._id !== userId) ||
    (i === messages.length - 1 &&
      messages[i].sender &&
      messages[i].sender._id !== userId)
  ) {
    return 0;
  } else {
    return "auto";
  }
};

export const isSameSender = (messages: any, m: any, i: any, userId: any) => {
  return (
    i < messages.length - 1 &&
    messages[i + 1].sender &&
    messages[i + 1].sender._id !== m.sender._id &&
    messages[i + 1].sender._id !== undefined &&
    messages[i].sender &&
    messages[i].sender._id !== userId
  );
};

export const isLastMessage = (messages: any, i: any, userId: any) => {
  if (
    i === messages.length - 1 &&
    messages[messages.length - 1].sender &&
    messages[messages.length - 1].sender._id !== undefined &&
    messages[messages.length - 1].sender._id !== userId
  ) {
    return true;
  } else {
    return false;
  }
};

export const isSameUser = (messages: any, m: any, i: any) => {
  return i > 0 && messages[i - 1].sender._id === m.sender._id;
};

export const getSenderFull = (loggedUser: any, users: any) => {
  return users[0]._id === loggedUser._id ? users[1] : users[0];
};
