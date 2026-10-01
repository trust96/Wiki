import { Chip, Group } from "@mantine/core";
import type { TGenre } from "@/services/schema";

const genres: TGenre[] = ["House", "Salsa", "Breaking", "Hip Hop"];

type TGenreFiltersProps = {
  value: TGenre[];
  onChange: (value: TGenre[]) => void;
};

export const GenreFilters = ({ value, onChange }: TGenreFiltersProps) => {
  return (
    <Chip.Group
      multiple
      value={value}
      onChange={(next) => onChange(next as TGenre[])}
    >
      <Group gap="xs">
        {genres.map((genre) => (
          <Chip key={genre} value={genre}>
            {genre}
          </Chip>
        ))}
      </Group>
    </Chip.Group>
  );
};
