package digital.patron.webmobile.exhibition.repository.custom;

import com.querydsl.jpa.impl.JPAQueryFactory;
import digital.patron.webmobile.exhibition.domain.Exhibition;
import org.springframework.stereotype.Repository;

import java.util.List;

import static digital.patron.webmobile.exhibition.domain.QExhibition.exhibition;
import static digital.patron.webmobile.exhibition.domain.QExhibitionExhibitionGroup.exhibitionExhibitionGroup;
import static digital.patron.webmobile.exhibition.domain.QExhibitionGroup.exhibitionGroup;

@Repository
public class ExhibitionGroupRepositoryImpl implements ExhibitionGroupRepositoryCustom {

    private final JPAQueryFactory queryFactory;

    public ExhibitionGroupRepositoryImpl(JPAQueryFactory queryFactory) {
        this.queryFactory = queryFactory;
    }

    @Override
    public List<Exhibition> findExhibitionsByExhibitionGroupNameAndLocalization(String groupName, String localization){
        return queryFactory
                .select(exhibition)
                .from(exhibitionGroup)
                .join(exhibitionGroup.exhibitionExhibitionGroups, exhibitionExhibitionGroup)
                .join(exhibitionExhibitionGroup.exhibition, exhibition)
                .where(exhibitionGroup.localization.contains(localization)
                        .and(exhibitionGroup.groupName.contains(groupName))
                        .and(!groupName.equals("전시그룹") ? exhibition.localization.contains(localization)
                                .and(exhibition.artworkExhibitions.isNotEmpty())
                                .and(exhibition.artistExhibitions.isNotEmpty())
                                .and(exhibition.artistExhibitions.any().artist.localization.contains(localization))
                                .and(exhibition.artworkExhibitions.any().artwork.localization.contains(localization)) : null))
                .orderBy(groupName.equals("전시그룹") ? exhibition.startDate.asc() : exhibitionExhibitionGroup.id.asc())
                .limit(15)
                .fetch();
    }
}
