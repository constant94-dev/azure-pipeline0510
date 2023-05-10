package digital.patron.webmobile.member.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.util.List;

@Data
@AllArgsConstructor
public class CollectionDto {
    private List<String> collectionNames;
    private List<Long> collectionIds;
    private List<Boolean> alreadyInCollection;
    private List<String> recentCollectionNames;
    private List<Long> recentCollectionIds;
    private List<Boolean> alreadyInRecentCollection;
}
