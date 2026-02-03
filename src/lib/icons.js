import { Icon } from 'lucide-svelte';

export const getIcon = (title) => {
  const icons = {
    "My Approach: Direct, Not Performative": "message-square",
    "The Blog: My Living Document": "book-open",
    "Room to Be Imperfect": "shuffle",
    "Why I Speak French (and Why Code is English)": "languages",
    "Who I Really Am": "user"
  };
  return icons[title] || "file";
};

export const IconName = getIcon;
