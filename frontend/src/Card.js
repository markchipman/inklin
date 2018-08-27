import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import classnames from 'classnames';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardMedia from '@material-ui/core/CardMedia';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import Collapse from '@material-ui/core/Collapse';
import Avatar from '@material-ui/core/Avatar';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import red from '@material-ui/core/colors/red';
import FavoriteIcon from '@material-ui/icons/Favorite';
import ShareIcon from '@material-ui/icons/Share';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';

const styles = theme => ({
    card: {
        backgroundColor: 'rgba(0,0,0,0.5)',
    },
    media: {
        height: 0,
        paddingTop: '56.25%', // 16:9
    },
    actions: {
        display: 'flex',
    },
    expand: {
        transform: 'rotate(0deg)',
        transition: theme.transitions.create('transform', {
            duration: theme.transitions.duration.shortest,
        }),
        marginLeft: 'auto',
        [theme.breakpoints.up('sm')]: {
            marginRight: -8,
        },
    },
    expandOpen: {
        transform: 'rotate(180deg)',
    },
    avatar: {
        backgroundColor: red[500],
    },
});

class RecipeReviewCard extends React.Component {
    state = { expanded: false };
    constructor(props) {
        super(props);
    }
    handleExpandClick = () => {
        this.setState(state => ({ expanded: !state.expanded }));
    };

    render() {
        const { classes } = this.props;
        const stats = `${this.props.numberoftxs} transactions (${this.props.block_info.tokens} ERC20), ${this.props.block_info.contracts} contracts created, Ξ${parseInt(this.props.block_info.ethvalue)} transferred`
        return (
            <Card className={classes.card}>
                <CardHeader
                    avatar={
                        <Avatar aria-label="Recipe" className={classes.avatar}>
                            B
            </Avatar>
                    }

                    title={this.props.title}
                    subheader={this.props.block_time}
                />

                <CardContent>
                    <Typography component="p" style={{width: "300px"}}>
                        {stats}
                    </Typography>
                </CardContent>
                <CardActions className={classes.actions} disableActionSpacing>
                    <IconButton aria-label="Add to favorites">
                        <FavoriteIcon />
                    </IconButton>
                    <IconButton aria-label="Share">
                        <ShareIcon />
                    </IconButton>
                    <IconButton
                        className={classnames(classes.expand, {
                            [classes.expandOpen]: this.state.expanded,
                        })}
                        onClick={this.handleExpandClick}
                        aria-expanded={this.state.expanded}
                        aria-label="Show more"
                    >
                        <ExpandMoreIcon />
                    </IconButton>
                </CardActions>
                <Collapse in={this.state.expanded} timeout="auto" unmountOnExit>
                    <CardContent className="transactions">
                        <List dense={true}>
                            {this.props.data.map(row => {
                                return (

                                    <ListItem>
                                        <ListItemText primary={`TxHash: ${row.hash}`} secondary={`From: ${row.from}\nTo: ${row.to}`} />
                                    </ListItem>

                                )
                            })}
                        </List>
                    </CardContent>
                </Collapse>
            </Card>
        );
    }
}

RecipeReviewCard.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(RecipeReviewCard);